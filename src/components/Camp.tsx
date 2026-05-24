import { useLevaControls } from '../hooks/useLevaControls';
import { useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';

const Camp = () => {
  const controls = useLevaControls('Camp', {
    position: [-2, 0.4, 25] as [number, number, number],
    rotation: [0, 1.75, 0] as [number, number, number],
    scale: 10,
  });

  const model = useGLTF('./models/echo_house/echo_house.glb');
  return (
    <>
      <RigidBody colliders="trimesh" type="fixed">
        <group position={controls.position} rotation={controls.rotation} scale={controls.scale}>
          <primitive object={model.scene} />
        </group>
      </RigidBody>
    </>
  );
};

export default Camp;
