import { useLevaControls } from '../hooks/useLevaControls';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useEffect } from 'react';

const Campfire = () => {
  const model = useGLTF('./models/camp_fire/camp_fire.glb');
  const animations = useAnimations(model.animations, model.scene);

  const controls = useLevaControls('Campfire', {
    position: {
      value: [-28.5, 1.2, -37] as [number, number, number],
      step: 0.5,
    },
    rotation: [0, 1.75, 0] as [number, number, number],
    scale: 10,
    animation: {
      value: animations.names[0],
      options: animations.names,
    },
  });

  useEffect(() => {
    const action = animations.actions[controls.animation];
    action?.reset().fadeIn(0.5).play();

    return () => {
      action?.fadeOut(0.5);
    };
  }, [controls.animation]);

  return (
    <>
      <group position={controls.position} rotation={controls.rotation} scale={controls.scale}>
        <primitive object={model.scene} />
        <pointLight intensity={70} distance={8} decay={2} color="#ff9e57" position={[0, 0.2, 0]} />
      </group>
    </>
  );
};

export default Campfire;
