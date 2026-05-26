import fragmentShader from '../shaders/globe/fragment.glsl';
import vertexShader from '../shaders/globe/vertex.glsl';
import { Sparkles, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { AdditiveBlending, BackSide, type Mesh, Vector3 } from 'three';

const Globe = () => {
  const globeRef = useRef<Mesh>(null);
  const [marker, setMarker] = useState<Vector3 | null>(null);

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
      <mesh
        onClick={(e) => {
          setMarker(e.point.clone());
          if (!globeRef.current) {
            return;
          }

          const localPoint = globeRef.current.worldToLocal(e.point.clone());
          localPoint.normalize();

          const lat = Math.asin(localPoint.y) * (180 / Math.PI);
          let lng = Math.atan2(-localPoint.x, -localPoint.z) * (180 / Math.PI);

          lng += 90;

          if (lng > 180) {
            lng -= 360;
          }

          if (lng < -180) {
            lng += 360;
          }

          console.log({
            lat,
            lng,
          });
        }}
        ref={globeRef}
      >
        <sphereGeometry args={[4, 64, 64]} />
        <meshStandardMaterial map={colorMap} bumpMap={bumpMap} bumpScale={0.04} />
      </mesh>
      {marker && (
        <mesh position={marker}>
          <sphereGeometry args={[0.05]} />
          <meshBasicMaterial color="red" />
        </mesh>
      )}
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
