import { useLevaControls } from '../hooks/useLevaControls';
import { useGlobeStore } from '../stores/experience';
import { CameraControls, Html, useCursor, useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { useEffect, useRef, useState } from 'react';
import { Euler, Vector3 } from 'three';

const Telescope = () => {
  const [hovered, setHovered] = useState(false);
  const setTelescopeMode = useGlobeStore((state) => state.setTelescopeMode);
  const telescopeMode = useGlobeStore((state) => state.telescopeMode);

  const controls = useLevaControls('Telescope', {
    position: {
      value: [50, 12, -8] as [number, number, number],
      step: 0.5,
    },
    rotation: [0, -0.35, 0] as [number, number, number],
    scale: 0.08,
  });

  const cameraControlsRef = useRef<CameraControls>(null);

  useEffect(() => {
    if (!telescopeMode || !cameraControlsRef.current) {
      return;
    }

    const position = new Vector3(
      controls.position[0],
      controls.position[1] + 40,
      controls.position[2],
    );

    const forward = new Vector3(0, 0, -1);

    forward.applyEuler(
      new Euler(controls.rotation[0], controls.rotation[1], controls.rotation[2], 'YXZ'),
    );

    const target = position.clone().add(forward.multiplyScalar(100));

    cameraControlsRef.current.setLookAt(
      position.x,
      position.y,
      position.z,

      target.x,
      target.y,
      target.z,

      true,
    );

    cameraControlsRef.current.dollyTo(0.001, false);
  }, [telescopeMode]);

  const model = useGLTF('./models/telescope/telescope.glb');
  useCursor(hovered, 'pointer');
  return (
    <>
      <RigidBody type="fixed" colliders="trimesh">
        <group
          visible={!telescopeMode}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          position={controls.position}
          rotation={controls.rotation}
          onClick={() => setTelescopeMode(true)}
        >
          <primitive scale={controls.scale} object={model.scene} />

          {!telescopeMode && (
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
          )}
          {telescopeMode && (
            <CameraControls
              ref={cameraControlsRef}
              enabled={telescopeMode}
              smoothTime={1.2}
              minDistance={0.1}
              maxDistance={0.1}
              truckSpeed={0}
              dollySpeed={0}
              polarRotateSpeed={0.08}
              azimuthRotateSpeed={0.18}
              minPolarAngle={0.8}
              maxPolarAngle={3.4}
            />
          )}
        </group>
      </RigidBody>
    </>
  );
};

export default Telescope;
