export interface Lake {
  id: string;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  fishUrl?: string;
}
