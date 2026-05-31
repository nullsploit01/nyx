import { useLevaControls } from '../hooks/useLevaControls';
import fragmentShader from '../shaders/stars/fragment.glsl';
import glowFragmentShader from '../shaders/stars/glow/fragment.glsl';
import glowVertexShader from '../shaders/stars/glow/vertex.glsl';
import vertexShader from '../shaders/stars/vertex.glsl';
import { useGlobeStore } from '../stores/globeStore';
import type { Star, VisibleStar } from '../types';
import { altAzToXYZ, colorFromCI } from '../utils';
import StarInfoCard from './StarInfoCard';
import { useCursor } from '@react-three/drei';
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

  const [hoveredStar, setHoveredStar] = useState<VisibleStar | null>(null);
  const [selectedStar, setSelectedStar] = useState<VisibleStar | null>(null);
  const visibleStarsRef = useRef<VisibleStar[]>([]);

  useEffect(() => {
    perspectiveCamera.fov = telescopeMode ? controls.telescopeFov : 90;
    perspectiveCamera.updateProjectionMatrix();
  }, [telescopeMode, controls.telescopeFov, perspectiveCamera]);

  useEffect(() => {
    const handleTap = () => {
      if (!telescopeMode) return;

      setTimeout(() => {
        setHoveredStar((currentHovered) => {
          if (currentHovered) {
            setSelectedStar(currentHovered);
          } else {
            setSelectedStar(null);
          }
          return currentHovered;
        });
      }, 0);
    };

    window.addEventListener('pointerup', handleTap);
    return () => {
      window.removeEventListener('pointerup', handleTap);
    };
  }, [telescopeMode]);

  useFrame((state) => {
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

    const closest = getClosestStar(visibleStarsRef.current, state.pointer, camera);
    setHoveredStar(closest);
  });

  const getClosestStar = (
    starsList: VisibleStar[],
    pointerPos: THREE.Vector2,
    cam: THREE.Camera,
    maxDistance = 0.045,
  ) => {
    let closestStar: VisibleStar | null = null;
    let closestDistance = Infinity;

    starsList.forEach((star) => {
      const screenPos = star.worldPosition.clone().project(cam);

      const dx = screenPos.x - pointerPos.x;
      const dy = screenPos.y - pointerPos.y;

      let dist = Math.sqrt(dx * dx + dy * dy);

      dist *= 1 + star.magnitude * 0.08;

      if (dist < maxDistance && dist < closestDistance) {
        closestDistance = dist;
        closestStar = star;
      }
    });

    return closestStar;
  };

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
      const [ra, dec, mag, ci, proper, dist, spect, con, absmag, lum, bayer, flam, variable, rv] =
        star;
      const horizontal = Astronomy.Horizon(time, observer, ra * 15, dec, 'normal');

      if (horizontal.altitude < 0) {
        return;
      }

      const [x, y, z] = altAzToXYZ(horizontal.altitude, horizontal.azimuth, 500);
      positions.push(x, y, z);
      const color = colorFromCI(ci);
      color.lerp(new THREE.Color('white'), 0.65);
      colors.push(color.r, color.g, color.b);
      const brightness = Math.pow(10, -0.4 * mag);
      const size = Math.max(0.08, Math.pow(brightness, 0.9) * 15);
      sizes.push(size);
      visibleStars.push({
        name: proper || `${bayer} ${con}` || `${flam} ${con}` || 'Catalog Star',
        designation: bayer ? `${bayer} ${con}` : flam ? `${flam} ${con}` : '',
        constellation: con || 'Unknown',
        magnitude: mag,
        distance: dist * 3.26156,
        spectral: spect || 'Unknown',
        colorIndex: ci,
        luminosity: lum,
        absoluteMagnitude: absmag,
        variable: variable,
        radialVelocity: rv,
        worldPosition: new THREE.Vector3(x, y, z),
      });
    });

    visibleStarsRef.current = visibleStars;

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geom.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    return geom;
  }, [stars, elevation, date, coords]);

  useCursor(telescopeMode && hoveredStar !== null, 'pointer', 'auto');
  const activeStar = selectedStar ?? hoveredStar;

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

      {activeStar && <StarInfoCard star={activeStar} />}
      {activeStar && (
        <points
          position={[
            activeStar.worldPosition.x,
            activeStar.worldPosition.y,
            activeStar.worldPosition.z,
          ]}
        >
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[new Float32Array([0, 0, 0]), 3]} />
          </bufferGeometry>

          <shaderMaterial
            uniforms={{
              time: { value: 0 },
              glowColor: {
                value: new THREE.Color(colorFromCI(activeStar.colorIndex)),
              },
            }}
            transparent
            depthWrite={false}
            depthTest
            alphaTest={0.01}
            blending={THREE.AdditiveBlending}
            vertexShader={glowVertexShader}
            fragmentShader={glowFragmentShader}
          />
        </points>
      )}
    </>
  );
};

export default StarField;
