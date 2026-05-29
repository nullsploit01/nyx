import { Html, Sparkles, useProgress } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Glitch } from '@react-three/postprocessing';
import { BlendFunction, GlitchMode } from 'postprocessing';
import { useRef } from 'react';
import { Mesh, Vector2 } from 'three';

const Loader = () => {
  const { progress } = useProgress();

  const cubeRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x += delta;
      cubeRef.current.rotation.y += delta;
    }
  });

  return (
    <>
      <mesh ref={cubeRef}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="aliceblue" />
      </mesh>
      <Sparkles
        position={[0, 0, 0]}
        count={200}
        size={0.5}
        scale={14}
        speed={0.2}
        opacity={1}
        color="aliceblue"
      />
      <Glitch
        delay={new Vector2(6, 12)}
        duration={new Vector2(0.15, 0.35)}
        strength={new Vector2(0.02, 0.06)}
        mode={GlitchMode.SPORADIC}
        active
        ratio={0.12}
        columns={0.04}
        blendFunction={BlendFunction.NORMAL}
      />

      <Html
        fullscreen
        style={{
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: '32px',
            bottom: '28px',
            color: '#e8f6ff',
            fontFamily: 'sans-serif',
            userSelect: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            textAlign: 'right',
            textShadow: '0 0 18px rgba(180,220,255,0.25)',
          }}
        >
          <div
            style={{
              fontSize: '42px',
              fontWeight: 700,
              letterSpacing: '-0.06em',
              lineHeight: 1,
            }}
          >
            {Math.floor(progress)} %
          </div>

          <div
            style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.22em',
              opacity: 0.42,
            }}
          >
            Loading World
          </div>
        </div>
      </Html>
    </>
  );
};

export default Loader;
