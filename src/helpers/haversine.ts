export default function haversine(coord1: { lat: number; lng: number; }, coord2: { lat: number; lng: number; }): number {
  const toRadians = (angle: number): number => (angle * Math.PI) / 180;
  // Earth's radius in kilometers
  const earthRadius = 6371;

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
