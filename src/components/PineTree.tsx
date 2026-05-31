import { Clone, useGLTF } from '@react-three/drei';

type Props = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
};

const PineTree = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 0.1 }: Props) => {
  const model = useGLTF('./models/pine_tree/pine_tree_compressed.glb');
  return (
    <>
      <group position={position} scale={scale} rotation={rotation}>
        <Clone object={model.scene} />
      </group>
    </>
  );
};

export default PineTree;
