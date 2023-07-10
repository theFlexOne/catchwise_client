import axios from "axios";
import { useEffect, useState } from "react";
import Coords from "../types/Coords";

const IP_INFO_API_KEY = import.meta.env.VITE_IP_INFO_API_KEY as string;
const IP_INFO_API_URL = "https://ipinfo.io" as string;

export default function useUserLocation() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [error, setError] = useState<any | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords([longitude, latitude]);
      },
      async () => {
        try {
          const coords = await getCoordinatesFromIP();
          setCoords(coords);
        } catch (error) {
          setError(error);
        }
      }
    );
  }, []);

  return [coords, error] as const;
}

async function getCoordinatesFromIP(): Promise<[number, number]> {
  const url = new URL(IP_INFO_API_URL);
  url.search = new URLSearchParams({ token: IP_INFO_API_KEY }).toString();

  const { data: loc } = await axios.get(url.toString());
  const [lat, lng] = loc.loc.split(",");
  return [lng, lat];
}
