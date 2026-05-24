import { useLevaControls } from '../hooks/useLevaControls';
import { useGLTF } from '@react-three/drei';

const Tree = () => {
  const controls = useLevaControls('Tree', {
    position: [-50, 0, -10] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    scale: 0.1,
  });

  const model = useGLTF('./models/tree/pine_tree.glb');

  return (
    <>
      <group position={controls.position} rotation={controls.rotation} scale={controls.scale}>
        <primitive object={model.scene} />
      </group>
    </>
  );
};

export default Tree;
