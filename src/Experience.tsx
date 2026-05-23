import Moon from './components/Moon';
import StarField from './components/StarField';
import type { Star } from './types';
import { useEffect, useState } from 'react';

const Experience = () => {
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
  }, []);

  const testData = {
    latitude: 21.1458,
    longitude: 79.0882,
    elevation: 310,
    date: new Date(),
  };

  return (
    <>
      <Moon {...testData} />
      <StarField stars={stars} {...testData} />
    </>
  );
};

export default Experience;
