import { Lake } from '../types/Lake';
import haversine from './haversine';


export function filterByDistance({ lakes, coords, range }: { lakes: Lake[], coords: { lat: number; lng: number; }, range: number; }): Lake[] {
  return lakes.filter((lake) => {
    const distance = haversine(coords, { lat: lake.coordinates.latitude, lng: lake.coordinates.longitude });
    return distance <= range;
  });
}