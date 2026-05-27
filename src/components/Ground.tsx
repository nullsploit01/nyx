import { useLevaControls } from '../hooks/useLevaControls';
import Grass from './Grass';
import { useTexture } from '@react-three/drei';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { DoubleSide, RepeatWrapping } from 'three';

const Ground = () => {
  const controls = useLevaControls('Ground', {
    position: [0, 0, 0] as [number, number, number],
    rotation: [Math.PI * 0.5, 0, 0] as [number, number, number],
  });

  const texture = useTexture({
    displacementMap: '/textures/grass/grass_displacement.png',
    normalMap: '/textures/grass/grass_normal.png',
    roughnessMap: '/textures/grass/grass_roughness.png',
    map: '/textures/grass/grass_color.png',
    aoMap: '/textures/grass/grass_ao.png',
  });

  Object.values(texture).forEach((tex) => {
    tex.wrapS = RepeatWrapping;
    tex.wrapT = RepeatWrapping;
    tex.repeat.set(10, 10);
  });

  return (
    <>
      <RigidBody type="fixed" colliders={false}>
        <mesh position={controls.position} rotation={controls.rotation}>
          <circleGeometry args={[190, 128]} />
          <meshStandardMaterial
            displacementScale={0.4}
            roughness={1}
            metalness={0}
            {...texture}
            side={DoubleSide}
          />
        </mesh>
        <Grass />
        <CuboidCollider args={[1000, 5, 1000]} />
      </RigidBody>
    </>
  );
};

export default Ground;
