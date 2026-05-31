import Globe from './components/Globe';
import Ground from './components/Ground';
import Moon from './components/Moon';
import Player from './components/Player';
import Props from './components/Props';
import StarField from './components/StarField';
import { useGlobeStore } from './stores/globeStore';
import type { Star } from './types';
import { useGLTF, useTexture } from '@react-three/drei';
import { useEffect, useState } from 'react';

const Experience = () => {
  const showGlobe = useGlobeStore((state) => state.showGlobe);
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    fetch('/stars.json')
      .then((res) => res.json())
      .then((data: Star[]) => {
        setStars(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const testData = {
    elevation: 310,
    date: new Date(),
  };

  return (
    <>
      {showGlobe ? (
        <Globe />
      ) : (
        // <>
        //   <Ground />
        //   <Props />
        // </>
        <>
          <Moon {...testData} />
          <Ground />
          <Props />
          <Player />
          <StarField stars={stars} {...testData} />
        </>
      )}
    </>
  );
};

useGLTF.preload('./models/pine_tree/pine_tree.glb');
useGLTF.preload('./models/pin_location/pin_location.glb');
useGLTF.preload('./models/oak_tree/oak_tree.glb');
useGLTF.preload('./models/echo_house/echo_house.glb');
useGLTF.preload('./models/ghost/ghost.glb');
useGLTF.preload('./models/telescope/telescope.glb');
useGLTF.preload('./models/camp_fire/camp_fire.glb');
useGLTF.preload('./models/lantern/lantern.glb');
useGLTF.preload('./models/chair/chair.glb');
useTexture.preload('/textures/grass/grass_displacement.webp');
useTexture.preload('/textures/grass/grass_normal.webp');
useTexture.preload('/textures/grass/grass_roughness.webp');
useTexture.preload('/textures/grass/grass_color.webp');
useTexture.preload('/textures/grass/grass_ao.webp');
useTexture.preload('./textures/earth/8081_earthlights4k.webp');
useTexture.preload('./textures/earth/8081_earthbump4k.webp');

export default Experience;
