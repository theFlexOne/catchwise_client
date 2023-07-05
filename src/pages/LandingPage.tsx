import MapboxMap from '../components/MapboxMap/MapboxMap';
import { MapProvider } from '../contexts/MapContext/MapContext';
import useMap from '../contexts/MapContext/useMap';

// eslint-disable-next-line @typescript-eslint/ban-types
const LandingPage = () => {

  const { currentLake } = useMap();


  return (
    <div className="flex min-h-full">
      <div className="w-1/4 min-w-[300px] bg-zinc-200/70">
        {currentLake && (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold">{currentLake.name}</h2>
            <h3>Fish species</h3>
            <ul>
              {currentLake.fishSpecies.map(fish => (
                <li key={fish.id}>{fish.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="min-h-max w-full mx-auto">
        <MapboxMap />
      </div>
    </div>
  )
};

export default LandingPage;

