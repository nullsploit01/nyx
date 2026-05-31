import { useLevaControls } from '../hooks/useLevaControls';
import { useGLTF } from '@react-three/drei';
import { useEffect } from 'react';
import { Mesh } from 'three';

const Camp = () => {
  const controls = useLevaControls('Camp', {
    position: [-2, 1.2, 25] as [number, number, number],
    rotation: [0, 1.5, 0] as [number, number, number],
    scale: 10,
  });

  const model = useGLTF('./models/echo_house/echo_house_compressed.glb');

  useEffect(() => {
    model.scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, []);

  return (
    <>
      <group position={controls.position} rotation={controls.rotation} scale={controls.scale}>
        <primitive object={model.scene} />
      </group>
    </>
  );
};

export default Camp;
