import type { NominatimReverseResponse } from '../types';
import { create } from 'zustand';

type Coordinates = {
  lat: number;
  lng: number;
};

type GlobeStore = {
  showGlobe: boolean;
  setShowGlobe: (show: boolean) => void;
  coords: Coordinates | null;
  setCoords: (coords: Coordinates | null) => void;
  location: NominatimReverseResponse | null;
  setLocation: (location: NominatimReverseResponse | null) => void;
};

export const useGlobeStore = create<GlobeStore>((set) => ({
  showGlobe: true,
  setShowGlobe: (showGlobe) =>
    set({
      showGlobe,
    }),

  coords: null,
  setCoords: (coords) =>
    set({
      coords,
    }),

  location: null,
  setLocation: (location) =>
    set({
      location,
    }),
}));
