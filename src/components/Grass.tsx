import grassFragmentShader from '../shaders/grass/fragment.glsl';
import grassVertexShader from '../shaders/grass/vertex.glsl';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { DoubleSide, type InstancedMesh, Object3D, PlaneGeometry, ShaderMaterial } from 'three';

const GRASS_COUNT = 45000;

const Grass = () => {
  const grassRef = useRef<InstancedMesh>(null);

  const grassGeometry = useMemo(() => {
    const geo = new PlaneGeometry(0.18, 1.8, 1, 1);
    geo.translate(0, 0.5, 0);
    return geo;
  }, []);

  const grassMaterial = useMemo(() => {
    return new ShaderMaterial({
      vertexShader: grassVertexShader,
      fragmentShader: grassFragmentShader,

      uniforms: {
        time: {
          value: 0,
        },
      },
      side: DoubleSide,
    });
  }, []);

  useEffect(() => {
    if (!grassRef.current) {
      return;
    }

    const dummy = new Object3D();

    for (let i = 0; i < GRASS_COUNT; i++) {
      const radius = Math.sqrt(Math.random()) * 120;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      dummy.position.set(x, 0.2, z);
      dummy.rotation.y = Math.random() * Math.PI;
      dummy.rotation.z = (Math.random() - 0.5) * 0.18;
      const scale = 1.2 + Math.random() * 1.5;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      grassRef.current.setMatrixAt(i, dummy.matrix);
    }

    grassRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame(({ clock }) => {
    grassMaterial.uniforms.time.value = clock.getElapsedTime();
  });

  return (
    <>
      <instancedMesh ref={grassRef} args={[grassGeometry, grassMaterial, GRASS_COUNT]} />
    </>
  );
};

export default Grass;
