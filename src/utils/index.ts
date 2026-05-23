import { Color } from 'three';

export const raDecToXYZ = (ra: number, dec: number, radius = 100): [number, number, number] => {
  const raRad = (ra * 15 * Math.PI) / 180;
  const decRad = (dec * Math.PI) / 180;
  const x = radius * Math.cos(decRad) * Math.cos(raRad);
  const y = radius * Math.sin(decRad);
  const z = radius * Math.cos(decRad) * Math.sin(raRad);
  return [x, y, z];
};

export const altAzToXYZ = (alt: number, az: number, radius = 500): [number, number, number] => {
  const altRad = (alt * Math.PI) / 180;
  const azRad = ((az - 180) * Math.PI) / 180;
  const x = radius * Math.cos(altRad) * Math.cos(azRad);
  const y = radius * Math.sin(altRad);
  const z = radius * Math.cos(altRad) * Math.sin(azRad);
  return [x, y, z];
};

export const colorFromCI = (ci: number) => {
  if (ci < 0) {
    return new Color('#9bbcff');
  }

  if (ci < 0.5) {
    return new Color('#cad7ff');
  }

  if (ci < 1) {
    return new Color('#fff4ea');
  }

  return new Color('#ffcc99');
};
