import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import LakeMarker from "./LakeMarker";
import { Lake } from "../types/Lake";
import MapSearchBar from "./MapSearchBar";
import useGooglePlaces from "../hooks/useGoogleApi";

const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;
const GOOGLE_API_CONFIG = {
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY as string,
  mapIds: ["45aff3ba656e7008"],
};
const MAP_OPTIONS: MapOptions = {
  mapId: "45aff3ba656e7008",
  disableDefaultUI: true,
  minZoom: 11,
  maxZoom: 17,
};

export default function Map({ center, zoom = 14 }: MapProps) {
  const { isLoaded, loadError } = useJsApiLoader(GOOGLE_API_CONFIG);
  const [mapObject, setMapObject] = useState<google.maps.Map | null>(null); //? could be a ref if all interactions are done via callbacks/handlers

  const [lakes, setLakes] = useState<Lake[]>([]);
  const [selectedLake, setSelectedLake] = useState<Lake | null>(null);

  const centerRef = useRef<LatLngLiteral>(center);

  const { searchForPlace, getPlaceDetails } = useGooglePlaces();


    function handleLoad(map: google.maps.Map) {
    //? using and clearing an interval because onLoad()
    //? is called before the map is actually ready
    const interval = setInterval(() => {
      const bounds = map.getBounds();

      //? until map has fully rendered, both NE and SW
      //? will be equal to each other (center)
      if (
        bounds?.getNorthEast().lat() === bounds?.getSouthWest().lat() &&
        bounds?.getNorthEast().lng() === bounds?.getSouthWest().lng()
      )
        return;

      clearInterval(interval);
      setMapObject(map);
      fetchLakesInRange(centerRef.current, setLakes)
    }, 10);
  }



  function handleMarkerClick(lake: Lake) {
    return () => setSelectedLake(lake);
  }

  async function handleSubmit(input: string) {
    input = input.trim() + " lake";

    const fields = [
      "name",
      "place_id",
      "geometry",
    ];

    const placeSearch = await searchForPlace(input, fields);
    const coords = placeSearch?.candidates[0]?.geometry
      .location as LatLngLiteral;

    console.log(placeSearch);
    console.log(coords);

    if (!coords) return;
    mapObject?.setCenter(coords);
  }
  
  useEffect(() => {
    if (!mapObject) return;
    console.log("mapObject", mapObject);
  }, [mapObject]);

  console.log("lake", lakes[0]);
  

  if (loadError) return <div>Error loading map. Try refreshing the page?</div>;

  return isLoaded ? (
    <div className="absolute inset-0 max-w-[960px] aspect-square mx-auto">
      <GoogleMap
        mapContainerStyle={{
          position: "absolute",
          inset: 0,
        }}
        options={MAP_OPTIONS}
        center={centerRef.current}
        zoom={zoom}
        onLoad={handleLoad}
      >
        {lakes.map((lake) => (
          <LakeMarker
            key={lake.id}
            lake={lake}
            onClick={handleMarkerClick(lake)}
            isSelected={selectedLake?.id === lake.id}
          />
        ))}
      </GoogleMap>
      <MapSearchBar
        className="absolute z-10 top-4 right-0"
        onSubmit={handleSubmit}
      />
    </div>
  ) : (
    <div>Loading...</div>
  );
}


async function fetchLakes(setLakes: Dispatch<SetStateAction<Lake[]>>) {
    const response = await axios.get(`${SERVER_URL}/api/v1/lakes`);
    setLakes(response.data);
}

async function fetchLakesInRange(center: LatLngLiteral, setLakes: Dispatch<SetStateAction<Lake[]>>): Promise<void> {
    const response = await axios.get(`${SERVER_URL}/api/v1/lakes/in-range?lat=${center.lat}&lng=${center.lng}&range=${241 * 1000}`);
    setLakes(response.data);

}



type MapProps = {
  center: LatLngLiteral;
  zoom?: number;
};
type LatLngLiteral = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;
type LatLngBounds = google.maps.LatLngBounds;
type LatLngBoundsLiteral = google.maps.LatLngBoundsLiteral;