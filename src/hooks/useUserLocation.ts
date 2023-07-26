import axios from "axios";
import { useEffect, useState } from "react";
import Coords from "../types/Coords";

const IP_INFO_API_KEY = import.meta.env.VITE_IP_INFO_API_KEY as string;
const IP_DATA_API_KEY = "16b3dfd707ec2e7141bdda96b4d2ec20ead5deadf8c8a1ffa68beaaf";
const IP_INFO_API_URL = "https://ipinfo.io" as string;

export default function useUserLocation() {
  const [ipCoords, setIPCoords] = useState<Coords | null>(null);
  const [navigatorCoords, setNavigatorCoords] = useState<Coords | null>(null);
  const [error, setError] = useState<any | null>(null);

  useEffect(() => {
    getCoordsFromBrowser((position) => {
      setNavigatorCoords([position.coords.longitude, position.coords.latitude]);
    });

    getCoordinatesFromIP().then((coords) => {
      setIPCoords([coords[0], coords[1]]);
    })

  }, []);

  return [
    navigatorCoords ?? ipCoords,
    error
  ] as const;
}

async function getCoordinatesFromIP(): Promise<[number, number]> {
  const url = new URL(IP_INFO_API_URL);
  url.search = new URLSearchParams({ token: IP_INFO_API_KEY }).toString();

  const { data } = await axios.get(url.toString());
  const [lat, lng] = data.loc.split(",");
  return [lng, lat];
}

const getCoordsFromBrowser = async (cb: (position: GeolocationPosition) => void, errCb?: (err: GeolocationPositionError) => void) => {
  navigator.geolocation.getCurrentPosition(cb, errCb, { enableHighAccuracy: true });
};

const getCoordsFromIP = async () => {
  const ip = await axios.get("https://checkip.amazonaws.com/").then((res) => res.data);
  const ipDataURL = new URL("https://api.ipdata.co/");
  ipDataURL.pathname = ip;
  ipDataURL.search = new URLSearchParams({ "api-key": IP_DATA_API_KEY }).toString();

  const { data } = await axios.get(ipDataURL.toString());
  const { latitude, longitude } = data;
  return [longitude, latitude];
};
