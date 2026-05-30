import { useLevaControls } from '../hooks/useLevaControls';
import { useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { useEffect } from 'react';
import { Mesh } from 'three';

const OakTree = () => {
  const controls = useLevaControls('Tree', {
    position: [-70, 0, 5] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    scale: 2.9,
  });

  const model = useGLTF('./models/oak_tree/oak_tree.glb');

  useEffect(() => {
    model.scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
      }
    });
  }, []);

  return (
    <>
      <RigidBody type="fixed">
        <group position={controls.position} rotation={controls.rotation} scale={controls.scale}>
          <primitive object={model.scene} />
        </group>
      </RigidBody>
    </>
  );
};

export default OakTree;
