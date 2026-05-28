import { useLevaControls } from '../hooks/useLevaControls';
import { Html, useCursor, useGLTF } from '@react-three/drei';
import { useState } from 'react';

const Telescope = () => {
  const [hovered, setHovered] = useState(false);

  const controls = useLevaControls('Telescope', {
    position: {
      value: [50, 15, -8] as [number, number, number],
      step: 0.5,
    },
    rotation: [0, -0.35, 0] as [number, number, number],
    scale: 0.1,
  });

  const model = useGLTF('./models/telescope/telescope.glb');
  useCursor(hovered, 'pointer');
  return (
    <>
      <group
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        position={controls.position}
        rotation={controls.rotation}
      >
        <primitive scale={controls.scale} object={model.scene} />

        <Html occlude position={[0, 12, 0]} center scale={10}>
          <div
            style={{
              padding: '10px 16px',
              borderRadius: '999px',
              background: 'rgba(4,8,18,0.38)',
              border: '1px solid rgba(180,220,255,0.08)',
              backdropFilter: 'blur(18px)',
              boxShadow: `
                    0 0 40px rgba(120,180,255,0.06),
                    0 0 100px rgba(120,180,255,0.02)
                `,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'rgba(235,245,255,0.92)',
              fontFamily: 'Inter, sans-serif',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              transform: 'translateY(-6px)',
            }}
          >
            <div
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '999px',
                background: '#dbeafe',
                boxShadow: '0 0 14px rgba(255,255,255,0.7)',
              }}
            />

            <span
              style={{
                fontSize: '0.9rem',
                letterSpacing: '0.01em',
              }}
            >
              Use the telescope to stargaze
            </span>
          </div>
        </Html>
      </group>
    </>
  );
};

export default Telescope;
