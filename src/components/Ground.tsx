import { useIsMobile } from '../hooks/useIsMobile';
import { useLevaControls } from '../hooks/useLevaControls';
import Grass from './Grass';
import { useTexture } from '@react-three/drei';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { useGame } from 'ecctrl';
import { useMemo, useRef } from 'react';
import { DoubleSide, NoColorSpace, RepeatWrapping, SRGBColorSpace, Vector2 } from 'three';

const Ground = () => {
  const isMobile = useIsMobile();
  const controls = useLevaControls('Ground', {
    position: [0, 0, 0] as [number, number, number],
    rotation: [Math.PI * 0.5, 0, 0] as [number, number, number],
    disableGrass: false,
  });

  const grassTexture = useTexture({
    displacementMap: '/textures/grass/grass_displacement.webp',
    normalMap: '/textures/grass/grass_normal.webp',
    roughnessMap: '/textures/grass/grass_roughness.webp',
    map: '/textures/grass/grass_color.webp',
    aoMap: '/textures/grass/grass_ao.webp',
  });

  const rocksTexture = useTexture({
    map: 'textures/rocks/rocks_diff.png',
    normalMap: 'textures/rocks/rocks_normal.png',
    aoMap: 'textures/rocks/rocks_arm.png',
    roughnessMap: 'textures/rocks/rocks_arm.png',
    metalnessMap: 'textures/rocks/rocks_arm.png',
  });

  useMemo(() => {
    if (grassTexture.map) grassTexture.map.colorSpace = SRGBColorSpace;
    Object.values(grassTexture).forEach((tex) => {
      if (!tex) return;
      tex.wrapS = RepeatWrapping;
      tex.wrapT = RepeatWrapping;
      tex.repeat.set(10, 10);
    });

    if (rocksTexture.map) rocksTexture.map.colorSpace = SRGBColorSpace;

    if (rocksTexture.normalMap) rocksTexture.normalMap.colorSpace = NoColorSpace;
    if (rocksTexture.aoMap) rocksTexture.aoMap.colorSpace = NoColorSpace;
    if (rocksTexture.roughnessMap) rocksTexture.roughnessMap.colorSpace = NoColorSpace;
    if (rocksTexture.metalnessMap) rocksTexture.metalnessMap.colorSpace = NoColorSpace;

    Object.values(rocksTexture).forEach((tex) => {
      if (!tex) return;
      tex.wrapS = RepeatWrapping;
      tex.wrapT = RepeatWrapping;
      tex.repeat.set(5, 2);
    });
  }, [grassTexture, rocksTexture]);

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
            {...grassTexture}
            side={DoubleSide}
          />
        </mesh>
        <CuboidCollider args={[120, 1, 120]} />

        <mesh position={[70, 0.01, 10]}>
          <boxGeometry args={[95, 1, 25]} />
          <meshStandardMaterial
            displacementScale={0.05}
            normalScale={new Vector2(1.5, 1.5)}
            roughness={0.9}
            metalness={0.0}
            {...rocksTexture}
            side={DoubleSide}
          />
        </mesh>

        {!controls.disableGrass && (
          <Grass
            ignoreZones={[
              //Pathway
              {
                position: [70, 1, 10],
                args: [95, 1, 25],
              },
              //Camp
              {
                position: [-28.5, 1.2, -25],
                args: [45, 1, 45],
              },
            ]}
          />
        )}
      </RigidBody>
    </>
  );
};

export default Ground;
