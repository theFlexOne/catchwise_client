import { useEffect } from 'react';
import { Lake } from "../types/Lake";
import useLakes from "../hooks/useLakes";
import MapboxMap from '../components/MapboxMap/MapboxMap';
import { MapProvider } from '../contexts/MapContext/MapContext';

// eslint-disable-next-line @typescript-eslint/ban-types
const LandingPage = ({ coords }: { coords: { lat: number, lng: number } }) => {




  return (
    <MapProvider coords={coords}>
      <div className="flex min-h-full">
        <div className="w-1/4 min-w-[300px] bg-zinc-200/70"></div>
        <div className="min-h-max w-full mx-auto">
          <MapboxMap center={coords} />
        </div>
      </div>
    </MapProvider>)
};

export default LandingPage;

