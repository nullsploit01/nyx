import fragmentShader from '../shaders/globe/fragment.glsl';
import vertexShader from '../shaders/globe/vertex.glsl';
import { Sparkles, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { AdditiveBlending, BackSide, type Mesh } from 'three';

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
      <mesh scale={1.006}>
        <sphereGeometry args={[4, 64, 64]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          depthTest={true}
          side={BackSide}
          blending={AdditiveBlending}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>
      <ambientLight intensity={7} />
      <Sparkles
        count={200}
        position={[0, 3, 0]}
        scale={12}
        size={1}
        speed={0.2}
        opacity={0.4}
        color="#88ccff"
      />
    </>
  );
};

export default Globe;
