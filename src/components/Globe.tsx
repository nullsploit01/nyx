import fragmentShader from '../shaders/globe/fragment.glsl';
import vertexShader from '../shaders/globe/vertex.glsl';
import { OrbitControls, Sparkles, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { AdditiveBlending, BackSide, type Mesh, Vector3 } from 'three';

const Globe = () => {
  const { camera } = useThree();

  const globeRef = useRef<Mesh>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);
  const introProgress = useRef(0);

  const [marker, setMarker] = useState<Vector3 | null>(null);
  const [introDone, setIntroDone] = useState(false);
  const [colorMap, bumpMap] = useTexture([
    './textures/earth/earth-night.jpg',
    './textures/earth/earth-topology.png',
  ]);

  useEffect(() => {
    camera.position.set(12, 4, 14);
  }, []);

  useFrame((_, delta) => {
    if (!globeRef.current) {
      return;
    }

    globeRef.current.rotation.y += delta * 0.02;

    if (!introDone && controlsRef.current) {
      introProgress.current += delta * 0.22;

      const t = Math.min(introProgress.current, 1);

      // smooth easing
      const eased = 1 - Math.pow(1 - t, 3);

      // curved cinematic motion
      camera.position.set(12 - eased * 8, 4 - eased * 3, 18 - eased * 11);
      camera.position.x += Math.sin(t * Math.PI) * 2;
      camera.lookAt(0, 0, 0);

      if (t >= 1) {
        setIntroDone(true);
        controlsRef.current?.target.set(0, 0, 0);
        controlsRef.current?.update();
      }
    }
  });

  return (
    <>
      <mesh
        onClick={(e) => {
          if (!globeRef.current || !introDone) {
            return;
          }

          const localPoint = globeRef.current.worldToLocal(e.point.clone());
          setMarker(localPoint.clone());
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

        {marker && (
          <mesh position={marker}>
            <sphereGeometry args={[0.05]} />
            <meshBasicMaterial color="red" />
          </mesh>
        )}
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
        count={1000}
        position={[0, 3, 0]}
        scale={100}
        size={1}
        speed={0.2}
        opacity={0.4}
        color="#88ccff"
      />
      <OrbitControls
        ref={controlsRef}
        enabled={introDone}
        enablePan={false}
        minDistance={5}
        maxDistance={20}
      />
    </>
  );
};

export default Globe;
