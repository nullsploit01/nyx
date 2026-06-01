import { useLevaControls } from '../hooks/useLevaControls';
import { useGlobeStore } from '../stores/globeStore';
import { Clone, useAnimations, useGLTF } from '@react-three/drei';
import { useEffect } from 'react';
import { Mesh } from 'three';

const Campfire = () => {
  const telescopeMode = useGlobeStore((state) => state.telescopeMode);

  const model = useGLTF('./models/camp_fire/camp_fire_compressed.glb');
  const logModel = useGLTF('./models/log/log_compressed.glb');
  const animations = useAnimations(model.animations, model.scene);

  const controls = useLevaControls('Campfire', {
    position: {
      value: [-28.5, 1.2, -25] as [number, number, number],
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
      {!telescopeMode && (
        <group position={controls.position} rotation={controls.rotation} scale={controls.scale}>
          <primitive object={model.scene} />
          <Clone
            scale={1.5}
            rotation={[0, -0.4, Math.PI]}
            object={logModel.scene}
            position={[2.2, 0.2, 1.4]}
          />
          <Clone
            scale={1.5}
            object={logModel.scene}
            position={[0.7, 0.2, -1.4]}
            rotation={[0, 1.2, Math.PI]}
          />
          <pointLight
            intensity={70}
            distance={8}
            decay={2}
            color="#ff9e57"
            position={[0, 0.2, 0]}
          />
        </group>
      )}
    </>
  );
};

export default Campfire;
