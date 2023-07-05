export default function haversine(coord1: { lat: number; lng: number; }, coord2: { lat: number; lng: number; }, units = 'meters'): number {
  const toRadians = (angle: number): number => (angle * Math.PI) / 180;

  const earthRadius = (() => {
    switch (units.toLowerCase()) {
      case 'meters':
        return 6371000;
      case 'kilometers':
        return 6371;
      case 'miles':
        return 3959;
      case 'feet':
        return 20902231;
      default:
        return 6371000;
    }
  })()

  const dLat = toRadians(coord2.lat - coord1.lat);
  const dLon = toRadians(coord2.lng - coord1.lng);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.lat)) * Math.cos(toRadians(coord2.lat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c;
  return distance;
}

export function oldHaversine(coord1: { lat: number; lng: number; }, coord2: { lat: number; lng: number; }, units = 'meters'): number {
  const toRadians = (angle: number): number => (angle * Math.PI) / 180;
  const earthRadius = 6371000; // meters

  const dLat = toRadians(coord2.lat - coord1.lat);
  const dLon = toRadians(coord2.lng - coord1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.lat)) *
    Math.cos(toRadians(coord2.lat)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c;

  return distance;
}
