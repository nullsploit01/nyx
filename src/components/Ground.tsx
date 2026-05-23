import { useLevaControls } from '../hooks/useLevaControls';
import { DoubleSide } from 'three';

const Ground = () => {
  const controls = useLevaControls('Ground', {
    position: [0, -50, 0] as [number, number, number],
    rotation: [Math.PI * 0.5, 0, 0] as [number, number, number],
    color: 'green',
  });
  return (
    <>
      <mesh position={controls.position} rotation={controls.rotation}>
        <planeGeometry args={[1000000, 100000, 1]} />
        <meshStandardMaterial side={DoubleSide} color="green" />
      </mesh>
    </>
  );
};

export default Ground;
