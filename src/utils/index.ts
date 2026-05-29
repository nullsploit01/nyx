import type { VisibleStar } from '../types';
import { Color, MathUtils } from 'three';
import tzLookup from 'tz-lookup';

export const raDecToXYZ = (ra: number, dec: number, radius = 100): [number, number, number] => {
  const raRad = (ra * 15 * Math.PI) / 180;
  const decRad = (dec * Math.PI) / 180;
  const x = radius * Math.cos(decRad) * Math.cos(raRad);
  const y = radius * Math.sin(decRad);
  const z = radius * Math.cos(decRad) * Math.sin(raRad);
  return [x, y, z];
};

export const altAzToXYZ = (alt: number, az: number, radius = 500): [number, number, number] => {
  const altRad = MathUtils.degToRad(alt);

  const azRad = MathUtils.degToRad(az);

  const x = radius * Math.cos(altRad) * Math.sin(azRad);

  const y = radius * Math.sin(altRad);

  const z = radius * Math.cos(altRad) * Math.cos(azRad);

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

export type LocationTimeData = {
  timezone: string;
  localTime: string;
  date: string;
};

export const getLocationTime = (lat: number, lng: number): LocationTimeData => {
  const timezone = tzLookup(lat, lng);
  const now = new Date();

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const parts = formatter.formatToParts(now);
  const localTime = `${parts.find((p) => p.type === 'hour')?.value}:${
    parts.find((p) => p.type === 'minute')?.value
  } ${parts.find((p) => p.type === 'dayPeriod')?.value}`;

  const date = `${parts.find((p) => p.type === 'weekday')?.value}, ${
    parts.find((p) => p.type === 'month')?.value
  } ${parts.find((p) => p.type === 'day')?.value}, ${parts.find((p) => p.type === 'year')?.value}`;

  return {
    timezone,
    localTime,
    date,
  };
};

export const getSpectralDescription = (spectral: string) => {
  if (!spectral) {
    return 'Unknown star';
  }

  const type = spectral[0];

  switch (type) {
    case 'O':
      return 'Blue hypergiant';

    case 'B':
      return 'Blue-white giant';

    case 'A':
      return 'White main-sequence star';

    case 'F':
      return 'Yellow-white star';

    case 'G':
      return 'Yellow dwarf';

    case 'K':
      return 'Orange dwarf';

    case 'M':
      return 'Red dwarf';

    default:
      return spectral;
  }
};

export const getVisibilityText = (magnitude: number) => {
  if (magnitude < 0) {
    return 'Extremely bright';
  }

  if (magnitude < 1) {
    return 'Very bright';
  }

  if (magnitude < 2.5) {
    return 'Bright';
  }

  if (magnitude < 4) {
    return 'Visible';
  }

  return 'Faint';
};

export const getStarDescription = (spectral: string) => {
  if (!spectral) {
    return 'Unknown star';
  }

  const type = spectral[0];

  const luminosity = spectral.includes('I')
    ? 'supergiant'
    : spectral.includes('III')
      ? 'giant'
      : spectral.includes('V')
        ? 'main-sequence star'
        : 'star';

  switch (type) {
    case 'O':
      return `Blue ${luminosity}`;

    case 'B':
      return `Blue-white ${luminosity}`;

    case 'A':
      return `White ${luminosity}`;

    case 'F':
      return `Yellow-white ${luminosity}`;

    case 'G':
      return `Yellow ${luminosity}`;

    case 'K':
      return `Orange ${luminosity}`;

    case 'M':
      return `Red ${luminosity}`;

    default:
      return spectral;
  }
};

export const getStarAtmosphereText = (star: VisibleStar) => {
  if (star.magnitude < 1) {
    return 'One of the brighter stars visible in the night sky.';
  }

  if (star.spectral?.includes('I')) {
    return 'A massive luminous star nearing the final stages of its life.';
  }

  if (star.distance < 20) {
    return 'Relatively close to our solar system.';
  }

  return 'A distant stellar light drifting through the darkness of space.';
};

export const formatDistance = (ly: number) => {
  if (ly < 100) {
    return `${ly.toFixed(1)} light years`;
  }

  if (ly < 1000) {
    return `${Math.round(ly)} light years`;
  }

  return `${(ly / 1000).toFixed(1)}k light years`;
};

export const getSpectralGlow = (spectral: string) => {
  if (spectral?.startsWith('O') || spectral?.startsWith('B')) {
    return `
      radial-gradient(
        circle at top right,
        rgba(120,170,255,0.16),
        transparent 60%
      )
    `;
  }

  if (spectral?.startsWith('M')) {
    return `
      radial-gradient(
        circle at top right,
        rgba(255,120,120,0.12),
        transparent 60%
      )
    `;
  }

  if (spectral?.startsWith('K')) {
    return `
      radial-gradient(
        circle at top right,
        rgba(255,180,120,0.12),
        transparent 60%
      )
    `;
  }

  return `
    radial-gradient(
      circle at top right,
      rgba(255,255,255,0.08),
      transparent 60%
    )
  `;
};
