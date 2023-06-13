export interface Lake {
  id: string;
  name: string;
  localId: string;
  county: string;
  state: string;
  nearestTown: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  fishUrl: string;
}
