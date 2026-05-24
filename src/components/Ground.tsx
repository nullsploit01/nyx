import { useLevaControls } from '../hooks/useLevaControls';
import { useTexture } from '@react-three/drei';
import { DoubleSide, RepeatWrapping } from 'three';

const Ground = () => {
  const controls = useLevaControls('Ground', {
    position: [0, -50, 0] as [number, number, number],
    rotation: [Math.PI * 0.5, 0, 0] as [number, number, number],
    color: 'green',
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
    tex.repeat.set(1000, 1000);
    tex.center.set(0.5, 0.5);
  });

  return (
    <>
      <mesh position={controls.position} rotation={controls.rotation}>
        <planeGeometry args={[100000, 100000, 10]} />
        <meshStandardMaterial
          displacementScale={0.4}
          roughness={1}
          metalness={0}
          {...texture}
          side={DoubleSide}
        />
      </mesh>
    </>
  );
};

export default Ground;
