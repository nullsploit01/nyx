import { useLevaControls } from '../hooks/useLevaControls';

const Tree = () => {
  const controls = useLevaControls('Tree', {
    position: [0, 0, 0] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    scale: 0.05,
  });

  //   const model = useGLTF('./models/oak_tree/oak_tree.glb');
  return (
    <>
      <group position={controls.position} rotation={controls.rotation} scale={controls.scale}>
        {/* <primitive object={model.scene} /> */}
      </group>
    </>
  );
};

export default Tree;
