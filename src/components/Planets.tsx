import fragmentShader from '../shaders/planets/fragment.glsl';
import vertexShader from '../shaders/planets/vertex.glsl';
import { useGlobeStore } from '../stores/globeStore';
import { altAzToXYZ } from '../utils';
import * as Astronomy from 'astronomy-engine';
import { useMemo } from 'react';
import * as THREE from 'three';

type Props = {
  date: Date;
  elevation: number;
};

const PLANETS = [
  {
    body: Astronomy.Body.Mercury,
    color: '#cfcfcf',
  },
  {
    body: Astronomy.Body.Venus,
    color: '#fff3d6',
  },
  {
    body: Astronomy.Body.Mars,
    color: '#ff8f6b',
  },
  {
    body: Astronomy.Body.Jupiter,
    color: '#ffe5b4',
  },
  {
    body: Astronomy.Body.Saturn,
    color: '#fff0b0',
  },
];

const Planets = ({ date, elevation }: Props) => {
  const coords = useGlobeStore((state) => state.coords);

  const geometry = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];
    const rings: number[] = [];

    const latitude = coords?.lat ?? 0;
    const longitude = coords?.lng ?? 0;

    const observer = new Astronomy.Observer(latitude, longitude, elevation);
    const time = new Astronomy.AstroTime(date);

    PLANETS.forEach((planet) => {
      const equ = Astronomy.Equator(planet.body, time, observer, true, true);
      const horizontal = Astronomy.Horizon(time, observer, equ.ra, equ.dec, 'normal');
      if (horizontal.altitude < 0) {
        return;
      }

      const [x, y, z] = altAzToXYZ(horizontal.altitude, horizontal.azimuth, 500);
      positions.push(x, y, z);
      const color = new THREE.Color(planet.color);
      colors.push(color.r, color.g, color.b);
      const magnitude = Astronomy.Illumination(planet.body, time).mag;
      let size = Math.max(10, (-magnitude + 3) * 4);
      if (planet.body === Astronomy.Body.Jupiter) {
        size *= 1.5;
      }
      if (planet.body === Astronomy.Body.Saturn) {
        size *= 1.4;
      }
      sizes.push(size);
      rings.push(planet.body === Astronomy.Body.Saturn ? 1 : 0);
    });

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geom.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    geom.setAttribute('hasRing', new THREE.Float32BufferAttribute(rings, 1));
    return geom;
  }, [coords, elevation, date]);

  return (
    <points geometry={geometry}>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </points>
  );
};

export default Planets;
