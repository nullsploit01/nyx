import { useLevaControls } from '../hooks/useLevaControls';
import { useGlobeStore } from '../stores/globeStore';
import { useGLTF } from '@react-three/drei';
import { useEffect } from 'react';
import { Mesh } from 'three';

const OakTree = () => {
  const telescopeMode = useGlobeStore((state) => state.telescopeMode);
  const controls = useLevaControls('Tree', {
    position: [-70, 0, 5] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    scale: 2.9,
  });

  const model = useGLTF('./models/oak_tree/oak_tree_compressed.glb');

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

export default OakTree;
