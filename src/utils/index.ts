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
