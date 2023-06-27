export interface Lake {
  id: string;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  nearestTown?: string;
  fishUrl?: string;
  fish?: Fish[];

}
