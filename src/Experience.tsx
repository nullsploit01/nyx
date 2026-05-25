import Globe from './components/Globe';
import Ground from './components/Ground';
import Moon from './components/Moon';
import Player from './components/Player';
import Props from './components/Props';
import StarField from './components/StarField';
import type { Star } from './types';
import { useEffect, useState } from 'react';

const Experience = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [showGlobe, setShowGlobe] = useState(false);

  useEffect(() => {
    fetch('../public/stars.json')
      .then((res) => res.json())
      .then((data: Star[]) => {
        setStars(data);
      })
      .catch((err) => {
        console.error(err);
      });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(position);
      },
      (error) => {
        console.error(error);
        setShowGlobe(true);
      },
    );
  }, []);

  const testData = {
    latitude: location?.coords.latitude ?? 0,
    longitude: location?.coords.longitude ?? 0,
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
