import { useJsApiLoader } from "@react-google-maps/api";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { Lake } from "../types/Lake";
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;
const GOOGLE_API_CONFIG = {
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY as string,
  mapIds: ["45aff3ba656e7008"],
};

const useMap = (center: { lat: number, lng: number }) => {
  const { isLoaded, loadError } = useJsApiLoader(GOOGLE_API_CONFIG);
  const [mapObject, setMapObject] = useState<google.maps.Map | null>(null); //? could be a ref if all interactions are done via callbacks/handlers

  const [lakes, setLakes] = useState<Lake[]>([]);

  const startingCenterRef = useRef<LatLngLiteral>(center);

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
      fetchLakesInRange(center, setLakes)
    }, 10);
  }

  return {
    isLoaded,
    loadError,
    mapObject,
    lakes,
    onLoad: handleLoad,
  }

};

export default useMap;

async function fetchLakes(setLakes: Dispatch<SetStateAction<Lake[]>>) {
    const response = await axios.get(`${SERVER_URL}/api/v1/lakes`);
    setLakes(response.data);
}

async function fetchLakesInRange(center: LatLngLiteral, setLakes: Dispatch<SetStateAction<Lake[]>>): Promise<void> {
    const response = await axios.get(`${SERVER_URL}/api/v1/lakes/in-range?lat=${center.lat}&lng=${center.lng}&range=${100 * 1000}`);
    setLakes(response.data);

}


type LatLngLiteral = google.maps.LatLngLiteral;