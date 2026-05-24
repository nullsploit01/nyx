import type { Star } from '../types';
import { altAzToXYZ, colorFromCI } from '../utils';
import * as Astronomy from 'astronomy-engine';
import { useMemo } from 'react';
import * as THREE from 'three';

type Props = {
  stars: Star[];
  latitude: number;
  longitude: number;
  elevation: number;
  date: Date;
};

const StarField = ({ latitude, longitude, elevation, date, stars }: Props) => {
  const geometry = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];

    const observer = new Astronomy.Observer(latitude, longitude, elevation);

    const time = new Astronomy.AstroTime(date);

    stars.forEach((star) => {
      const [ra, dec, mag, ci] = star;

      const horizontal = Astronomy.Horizon(time, observer, ra * 15, dec, 'normal');

      // hide stars below horizon
      if (horizontal.altitude < 0) {
        return;
      }

      const [x, y, z] = altAzToXYZ(horizontal.altitude, horizontal.azimuth, 500);

      positions.push(x, y, z);

      // star color
      const color = colorFromCI(ci);
      colors.push(color.r, color.g, color.b);

      // brightness scaling
      const brightness = Math.pow(10, -0.4 * mag);
      const size = Math.max(0.01, brightness * 8);
      //   const size = THREE.MathUtils.lerp(0.02, 2, brightness);
      sizes.push(size);
    });

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    return geometry;
  }, [stars]);

  return (
    <points geometry={geometry}>
      <pointsMaterial vertexColors color="white" size={0.85} sizeAttenuation />
    </points>
  );
};

export default StarField;
