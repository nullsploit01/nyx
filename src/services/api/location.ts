import type { NominatimReverseResponse } from '../../types';
import axios from 'axios';

export const getLocationByLatAndLng = async (lat: number, lng: number) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat.toFixed(2)}&lon=${lng.toFixed(2)}`;
  return await axios.get<NominatimReverseResponse>(url);
};
