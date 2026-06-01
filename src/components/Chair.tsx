import { useLevaControls } from '../hooks/useLevaControls';
import { useGlobeStore } from '../stores/globeStore';
import { useGLTF } from '@react-three/drei';
import { useEffect } from 'react';
import { Mesh } from 'three';

const Chair = () => {
  const telescopeMode = useGlobeStore((state) => state.telescopeMode);

  const model = useGLTF('./models/chair/chair_compressed.glb');
  const controls = useLevaControls('Chair', {
    position: {
      value: [13.5, 0, -43] as [number, number, number],
      step: 0.5,
    },
    rotation: [0, 1.5, 0] as [number, number, number],
    scale: 5,
  });

  useEffect(() => {
    model.scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
      }
    });
  }, []);

  return (
    <>
      {!telescopeMode && (
        <group position={controls.position} rotation={controls.rotation} scale={controls.scale}>
          <primitive object={model.scene} />
        </group>
      )}
    </>
  );
};

export default Chair;
