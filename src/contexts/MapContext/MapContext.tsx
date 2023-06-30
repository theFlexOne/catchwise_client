import { createContext, useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Lake } from '../../types/Lake';
import ViewStateChangeEvent, { PaddingOptions, ViewState } from 'react-map-gl';

export const MapContext = createContext<MapContextType | null>(null);

export const MapProvider = ({ children, coords }: { children: React.ReactNode, coords?: { lat: number, lng: number } }) => {
  const [viewState, setViewState] = useState<ViewState>({
    latitude: coords?.lat || 0,
    longitude: coords?.lng || 0,
    zoom: 10,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  const [lakes, setLakes] = useState<Lake[]>([]);
  const mapRef = useRef<any>(null);

  async function getLakes({ lat, lng }: { lat: number, lng: number }, options?: Options) {
    const url = new URL("http://localhost:8080/api/v1/lakes/markers");
    url.searchParams.append("lat", lat.toString());
    url.searchParams.append("lng", lng.toString());

    try {
      const response = await axios.get(url.toString(), options);
      setLakes(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!coords) return;
    const controller = new AbortController();
    getLakes(coords, { signal: controller.signal });
    return () => controller.abort();
  }, [coords]);

  return (
    <MapContext.Provider value={{ lakes, getLakes, mapRef, viewState }}>
      {children}
    </MapContext.Provider>
  );
}

type MapContextType = {
  lakes: Lake[];
  mapRef: React.MutableRefObject<any>;
  getLakes: ({ lat, lng }: { lat: number, lng: number }) => void;
  viewState: ViewState;
}

type MapProviderProps = {
  children: React.ReactNode;
  coords?: { lat: number, lng: number };
}

type Options = {
  signal?: AbortSignal | undefined;
  [key: string]: any;
}