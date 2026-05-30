import { useLevaControls } from '../hooks/useLevaControls';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useEffect } from 'react';
import { Mesh } from 'three';

const Lantern = () => {
  const model = useGLTF('./models/lantern/lantern.glb');
  const animations = useAnimations(model.animations, model.scene);

  const controls = useLevaControls('Lantern', {
    position: {
      value: [55, -0.3, 32] as [number, number, number],
      step: 0.5,
    },
    rotation: [0, 1.75, 0] as [number, number, number],
    scale: 0.15,
    animation: {
      value: animations.names[0],
      options: animations.names,
    },
  });

  useEffect(() => {
    model.scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
      }
    });
  }, []);

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
        <pointLight intensity={100} distance={10} decay={2} color="#ff9e57" position={[0, 97, 0]} />
      </group>
    </>
  );
};

export default Lantern;
