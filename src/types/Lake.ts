import Fish from './Fish';

type Lake = {
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