import { useIsMobile } from '../hooks/useIsMobile';
import { useLevaControls } from '../hooks/useLevaControls';
import Grass from './Grass';
import { useTexture } from '@react-three/drei';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { useGame } from 'ecctrl';
import { useRef } from 'react';
import { DoubleSide, RepeatWrapping } from 'three';

const Ground = () => {
  const isMobile = useIsMobile();
  const controls = useLevaControls('Ground', {
    position: [0, 0, 0] as [number, number, number],
    rotation: [Math.PI * 0.5, 0, 0] as [number, number, number],
  });

  const texture = useTexture({
    displacementMap: '/textures/grass/grass_displacement.webp',
    normalMap: '/textures/grass/grass_normal.webp',
    roughnessMap: '/textures/grass/grass_roughness.webp',
    map: '/textures/grass/grass_color.webp',
    aoMap: '/textures/grass/grass_ao.webp',
  });

  Object.values(texture).forEach((tex) => {
    tex.wrapS = RepeatWrapping;
    tex.wrapT = RepeatWrapping;
    tex.repeat.set(10, 10);
  });

  const date = useRef(0);
  const setMoveToPoint = useGame((state) => state.setMoveToPoint);
  return (
    <>
      <RigidBody type="fixed">
        <mesh
          onPointerDown={() => {
            date.current = Date.now();
          }}
          onPointerUp={({ point }) => {
            const wasClick = Date.now() - date.current < 200;
            if (!wasClick || !isMobile) {
              return;
            }

            setMoveToPoint({
              x: point.x,
              y: 0,
              z: point.z,
            } as never);
          }}
          position={controls.position}
          rotation={controls.rotation}
          receiveShadow
        >
          <circleGeometry args={[125, 128]} />
          <meshStandardMaterial
            displacementScale={0.4}
            roughness={1}
            metalness={0}
            {...texture}
            side={DoubleSide}
          />
        </mesh>
        <Grass />
        <CuboidCollider args={[120, 1, 120]} />
      </RigidBody>
    </>
  );
};

export default Ground;
