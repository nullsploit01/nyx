import type { Vector3 } from 'three';

export type Star = [
  ra: number,
  dec: number,
  mag: number,
  ci: number,
  proper: string,
  dist: number,
  spect: string,
  con: string,
  absmag: number,
  lum: number,
  bayer: string,
  flam: number,
  variable: string,
  rv: number,
];

export type NominatimReverseResponse = {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  address: {
    village?: string;
    town?: string;
    city?: string;
    hamlet?: string;
    suburb?: string;
    county?: string;
    state_district?: string;
    state?: string;
    country?: string;
    country_code?: string;
    ['ISO3166-2-lvl4']?: string;
  };
  boundingbox: [string, string, string, string];
  error?: string;
};

export type VisibleStar = {
  name: string;
  designation: string;
  constellation: string;
  magnitude: number;
  distance: number;
  spectral: string;
  luminosity: number;
  absoluteMagnitude: number;
  variable: string;
  radialVelocity: number;
  worldPosition: Vector3;
};
