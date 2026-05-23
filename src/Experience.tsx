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

  return (
    <>
      <StarField stars={stars} />
    </>
  );
};

export default Experience;
