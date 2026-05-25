import { Sparkles, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';

const Globe = () => {
  const globeRef = useRef<Mesh>(null);

  const [colorMap, bumpMap] = useTexture([
    './textures/earth/earth-night.jpg',
    './textures/earth/earth-topology.png',
  ]);

  useFrame((_, delta) => {
    if (!globeRef.current) {
      return;
    }

    globeRef.current.rotation.y += delta * 0.05;
  });

  return (
    <>
      <mesh ref={globeRef}>
        <sphereGeometry args={[4, 64, 64]} />
        <meshStandardMaterial map={colorMap} bumpMap={bumpMap} bumpScale={0.04} />
      </mesh>
      <ambientLight intensity={10} />
      <Sparkles />
    </>
  );
};

export default Globe;
