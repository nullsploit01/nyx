import { useLevaControls } from '../hooks/useLevaControls';
import fragmentShader from '../shaders/stars/fragment.glsl';
import vertexShader from '../shaders/stars/vertex.glsl';
import { useGlobeStore } from '../stores/experience';
import type { Star } from '../types';
import { altAzToXYZ, colorFromCI } from '../utils';
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
    telescopeZoom: 1.0,
  });

  const coords = useGlobeStore((state) => state.coords);
  const [telescopeMode, setTelescopeMode] = useState(false);

  const { camera } = useThree();
  const perspectiveCamera = camera as THREE.PerspectiveCamera;
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'h') {
        const nextTelescopeMode = perspectiveCamera.fov !== controls.telescopeFov;
        perspectiveCamera.fov = nextTelescopeMode ? controls.telescopeFov : 90;
        perspectiveCamera.updateProjectionMatrix();
        setTelescopeMode(nextTelescopeMode);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [camera]);

  useFrame(() => {
    if (!materialRef.current) {
      return;
    }

    materialRef.current.uniforms.telescopeZoom.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.telescopeZoom.value,
      telescopeMode ? 40 : 1,
      0.8,
    );
  });

  const geometry = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];

    const latitude = coords?.lat ?? 0;
    const longitude = coords?.lng ?? 0;

    const observer = new Astronomy.Observer(latitude, longitude, elevation);

    const time = new Astronomy.AstroTime(date);

    stars.forEach((star) => {
      const [ra, dec, mag, ci] = star;

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

      // brightness scaling
      const brightness = Math.pow(10, -0.4 * mag);
      const size = Math.max(0.08, Math.pow(brightness, 0.9) * 15);
      sizes.push(size);
    });

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    return geometry;
  }, [stars, elevation, date, coords]);

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        uniforms={{
          telescopeZoom: {
            value: controls.telescopeZoom,
          },
        }}
        transparent={true}
        depthWrite={false}
        vertexColors={true}
        blending={THREE.AdditiveBlending}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </points>
  );
};

export default StarField;
