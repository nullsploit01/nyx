import { useLevaControls } from '../hooks/useLevaControls';
import { useGlobeStore } from '../stores/globeStore';
import { useAnimations, useGLTF } from '@react-three/drei';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import Ecctrl from 'ecctrl';
import { useEffect } from 'react';

const Player = () => {
  const model = useGLTF('./models/ghost/ghost_compressed.glb');

  const animations = useAnimations(model.animations, model.scene);
  const telescopeMode = useGlobeStore((state) => state.telescopeMode);

  const controls = useLevaControls('Player', {
    position: [-1.3, 11.3, 36] as [number, number, number],
    rotation: [0, Math.PI, 0] as [number, number, number],
    scale: 10,
    disableControls: false,
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
      <Ecctrl
        camCollision={false}
        camInitDis={-0.01}
        camMinDis={-0.01}
        camFollowMult={telescopeMode ? 0 : 1000}
        camLerpMult={telescopeMode ? 0 : 1000}
        turnVelMultiplier={1}
        turnSpeed={10}
        mode="PointToMove"
        maxVelLimit={40}
        disableFollowCam={controls.disableControls || telescopeMode}
        disableControl={controls.disableControls || telescopeMode}
        jumpVel={0}
        camTargetPos={{ x: 0, y: 10, z: 0 }}
        camInitDir={{ x: 0, y: Math.PI }}
      >
        <RigidBody position={controls.position} rotation={controls.rotation}>
          <group visible={false} scale={controls.scale}>
            <primitive object={model.scene} />
          </group>
          <CuboidCollider args={[0.2, 0.5, 0.3]} />
        </RigidBody>
      </Ecctrl>
    </>
  );
};

export default Player;
