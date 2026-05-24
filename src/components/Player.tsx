import { useLevaControls } from '../hooks/useLevaControls';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useEffect } from 'react';

const Player = () => {
  const model = useGLTF('./models/ghost/ghost.glb');

  const animations = useAnimations(model.animations, model.scene);

  const controls = useLevaControls('Player', {
    position: [0, 8, 0] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    scale: 1,
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
      </group>
    </>
  );
};

export default Player;
