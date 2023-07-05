import Fish from './Fish';

interface Lake {
  id: number;
  name: string;
  geometry: {
    type: string;
    coordinates: any[];
  };
  nearestTown?: string;
  fishSpecies: Fish[];
}

export default Lake;