import Lake from '../types/Lake';
import haversine from './haversine';


export const filterByDistance = (lakes: Lake[], coords: { lat: number; lng: number; }, range: number): Lake[] => (
  lakes.filter((lake) => {
    const distance = haversine(coords, { lat: lake.geometry.coordinates[1], lng: lake.geometry.coordinates[0] });
    return distance <= range;
  })
)