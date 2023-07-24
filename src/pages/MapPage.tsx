import MapboxMap from "../components/MapboxMap/MapboxMap";
import useMap from "../contexts/MapContext/useMap";

const MapPage = () => {
  const { selectedLocation: currentLake } = useMap();


  return (
    <div className="flex min-h-full">
      <div className="min-h-max w-full mx-auto">
        <MapboxMap />
      </div>
    </div>
  )
}

export default MapPage