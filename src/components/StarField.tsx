import type { Star } from '../types';
import { altAzToXYZ } from '../utils';
import * as Astronomy from 'astronomy-engine';
import { useMemo } from 'react';
import * as THREE from 'three';

type Props = {
  stars: Star[];
};

function colorFromCI(ci: number) {
  if (ci < 0) {
    return new THREE.Color('#9bbcff');
  }

  if (ci < 0.5) {
    return new THREE.Color('#cad7ff');
  }

  if (ci < 1) {
    return new THREE.Color('#fff4ea');
  }

  return new THREE.Color('#ffcc99');
}

export default function StarField({ stars }: Props) {
  const geometry = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];

    const observer = new Astronomy.Observer(21.1458, 79.0882, 310);

    const time = new Astronomy.AstroTime(new Date());

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
      const size = Math.max(0.02, Math.pow(1.5 - mag / 6, 3) * 3);
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
      <pointsMaterial vertexColors color="white" size={0.7} sizeAttenuation />
    </points>
  );
}
