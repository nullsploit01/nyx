import { useLevaControls } from '../hooks/useLevaControls';
import fragmentShader from '../shaders/stars/fragment.glsl';
import vertexShader from '../shaders/stars/vertex.glsl';
import { useGlobeStore } from '../stores/experience';
import type { Star, VisibleStar } from '../types';
import {
  altAzToXYZ,
  colorFromCI,
  formatDistance,
  getSpectralGlow,
  getStarAtmosphereText,
  getStarDescription,
  getVisibilityText,
} from '../utils';
import { Html } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as Astronomy from 'astronomy-engine';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

type Props = {
  stars: Star[];
  elevation: number;
  date: Date;
};

const StarField = ({ elevation, date, stars }: Props) => {
  const controls = useLevaControls('StarField', {
    telescopeFov: 40,
  });

  const coords = useGlobeStore((state) => state.coords);
  const telescopeMode = useGlobeStore((state) => state.telescopeMode);
  const { camera } = useThree();
  const perspectiveCamera = camera as THREE.PerspectiveCamera;
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef(new THREE.Vector2());
  const [hoveredStar, setHoveredStar] = useState<VisibleStar | null>(null);
  const visibleStarsRef = useRef<VisibleStar[]>([]);
  useEffect(() => {
    perspectiveCamera.fov = telescopeMode ? controls.telescopeFov : 90;
    perspectiveCamera.updateProjectionMatrix();
  }, [telescopeMode, controls.telescopeFov]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.telescopeZoom.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.telescopeZoom.value,
        telescopeMode ? 40 : 1,
        0.08,
      );
    }

    if (!telescopeMode) {
      setHoveredStar(null);
      return;
    }

    let closestStar: VisibleStar | null = null;
    let closestDistance = Infinity;

    visibleStarsRef.current.forEach((star) => {
      const screenPos = star.worldPosition.clone().project(camera);
      const dx = screenPos.x - mouse.current.x;
      const dy = screenPos.y - mouse.current.y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      // brighter stars easier to hover
      dist *= 1 + star.magnitude * 0.08;
      if (dist < 0.035 && dist < closestDistance) {
        closestDistance = dist;
        closestStar = star;
      }
    });

    setHoveredStar(closestStar);
  });

  const geometry = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];
    const visibleStars: VisibleStar[] = [];
    const latitude = coords?.lat ?? 0;
    const longitude = coords?.lng ?? 0;
    const observer = new Astronomy.Observer(latitude, longitude, elevation);
    const time = new Astronomy.AstroTime(date);

    stars.forEach((star) => {
      const [ra, dec, mag, ci, proper, dist, spect, con] = star;
      const horizontal = Astronomy.Horizon(time, observer, ra * 15, dec, 'normal');

      // hide stars below horizon
      if (horizontal.altitude < 0) {
        return;
      }

      const [x, y, z] = altAzToXYZ(horizontal.altitude, horizontal.azimuth, 500);
      positions.push(x, y, z);
      const color = colorFromCI(ci);
      color.lerp(new THREE.Color('white'), 0.65);
      colors.push(color.r, color.g, color.b);
      const brightness = Math.pow(10, -0.4 * mag);
      const distanceLightYears = dist * 3.26156;
      const size = Math.max(0.08, Math.pow(brightness, 0.9) * 15);
      sizes.push(size);
      visibleStars.push({
        name: proper || `${con} ${spect}` || 'Catalog Star',
        constellation: con || 'Unknown',
        magnitude: mag,
        distance: distanceLightYears,
        spectral: spect || 'Unknown',
        worldPosition: new THREE.Vector3(x, y, z),
      });
    });

    visibleStarsRef.current = visibleStars;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    return geometry;
  }, [stars, elevation, date, coords]);

  return (
    <>
      <points geometry={geometry}>
        <shaderMaterial
          ref={materialRef}
          uniforms={{
            telescopeZoom: {
              value: 1,
            },
          }}
          transparent
          depthWrite={false}
          vertexColors
          blending={THREE.AdditiveBlending}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </points>

      {hoveredStar && (
        <Html
          position={[
            hoveredStar.worldPosition.x,
            hoveredStar.worldPosition.y,
            hoveredStar.worldPosition.z,
          ]}
        >
          <div
            style={{
              minWidth: '240px',
              padding: '18px 20px',
              borderRadius: '24px',
              background: 'rgba(5,8,16,0.34)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255,255,255,0.05)',
              transform: 'translate3d(48px,-50%,0)',
              boxShadow: `
                0 0 80px rgba(120,180,255,0.06),
                inset 0 0 0 1px rgba(255,255,255,0.015)
              `,
              color: 'white',
              fontFamily: 'Inter, sans-serif',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: getSpectralGlow(hoveredStar.spectral),
                opacity: 0.55,
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'relative',
                zIndex: 1,
              }}
            >
              <div
                style={{
                  fontSize: '0.68rem',
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: 'rgba(180,200,255,0.38)',
                }}
              >
                {hoveredStar.constellation}
              </div>
              <h2
                style={{
                  margin: '10px 0 0',
                  fontSize: '1.85rem',
                  lineHeight: 1,
                  fontWeight: 700,
                  letterSpacing: '-0.05em',
                }}
              >
                {hoveredStar.name}
              </h2>

              <div
                style={{
                  marginTop: '12px',
                  color: 'rgba(220,230,255,0.76)',
                  fontSize: '1rem',
                }}
              >
                {getStarDescription(hoveredStar.spectral)}
              </div>

              <div
                style={{
                  marginTop: '14px',
                  color: 'rgba(190,205,255,0.58)',
                  lineHeight: 1.6,
                  fontSize: '0.92rem',
                }}
              >
                {getStarAtmosphereText(hoveredStar)}
              </div>

              <div
                style={{
                  marginTop: '18px',
                  height: '1px',
                  background: 'rgba(255,255,255,0.05)',
                }}
              />

              <div
                style={{
                  marginTop: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '0.68rem',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'rgba(160,180,220,0.42)',
                    }}
                  >
                    Distance
                  </div>

                  <div
                    style={{
                      marginTop: '6px',
                      fontSize: '1.02rem',
                      fontWeight: 600,
                    }}
                  >
                    {formatDistance(hoveredStar.distance)}
                  </div>
                </div>

                <div
                  style={{
                    textAlign: 'right',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.68rem',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'rgba(160,180,220,0.42)',
                    }}
                  >
                    Visibility
                  </div>

                  <div
                    style={{
                      marginTop: '6px',
                      fontSize: '1.02rem',
                      fontWeight: 600,
                    }}
                  >
                    {getVisibilityText(hoveredStar.magnitude)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Html>
      )}
    </>
  );
};

export default StarField;
