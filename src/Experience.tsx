// import Globe from './components/Globe';
import Globe from './components/Globe';
import Ground from './components/Ground';
import Moon from './components/Moon';
import Player from './components/Player';
import Props from './components/Props';
import StarField from './components/StarField';
import { useGlobeStore } from './stores/experience';
import type { Star } from './types';
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
        // <Ground />
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

export default Experience;
