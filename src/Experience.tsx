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
  const coords = useGlobeStore((state) => state.coords);

  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    fetch('../public/stars.json')
      .then((res) => res.json())
      .then((data: Star[]) => {
        setStars(data);
      })
      .catch((err) => {
        console.error(err);
      });

    // navigator.geolocation.getCurrentPosition(
    //   (position) => {
    //     setLocation(position);
    //   },
    //   (error) => {
    //     console.error(error);
    //     setShowGlobe(true);
    //   },
    // );
  }, []);

  const testData = {
    latitude: coords?.lat ?? 0,
    longitude: coords?.lng ?? 0,
    elevation: 310,
    date: new Date(),
  };

  return (
    <>
      {showGlobe ? (
        <Globe />
      ) : (
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
