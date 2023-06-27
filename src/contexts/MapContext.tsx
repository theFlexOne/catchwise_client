import { createContext, useContext, useRef, useState } from "react";
import { Lake } from "../types/Lake";
import axios from "axios";
import { MapRef, ViewStateChangeEvent } from "react-map-gl";
import haversine from "../helpers/haversine";


export const MapContext = createContext<MapContextType | null>(null);

export const MapProvider = ({ children }: { children: React.ReactNode }) => {
  const [viewState, setViewState] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 14,
  });

  const [markers, setMarkers] = useState<Lake[]>([]);

  const [selectedLake, setSelectedLake] = useState<Lake | null>(null);

  const mapRef = useRef<MapRef>(null)
  // const baseCenterRef = useRef(center);





  const handleMove = (e: ViewStateChangeEvent) => {
    // const distanceFromBase = haversine(baseCenterRef.current, { lat: e.viewState.latitude, lng: e.viewState.longitude });
    // if (distanceFromBase > 40) {
    //   baseCenterRef.current = { lat: e.viewState.latitude, lng: e.viewState.longitude };
    //   fetchLakeMarkers({ lat: e.viewState.latitude, lng: e.viewState.longitude });
    // }

    setViewState({
      longitude: e.viewState.longitude,
      latitude: e.viewState.latitude,
      zoom: e.viewState.zoom,
    });
  }

  const handleMarkerClick = async (lake: Lake) => {
    const lakeDetails = await fetchLakeDetails(lake.id);


    setSelectedLake(lakeDetails);
    mapRef.current?.flyTo({
      center: [lake.coordinates.longitude, lake.coordinates.latitude],
      zoom: 14,
      essential: true
    });

  }

  const handleLoad = async (center: { lat: number, lng: number }) => {
    const markers = await fetchLakeMarkers(center);
    setMarkers(markers);
    setViewState({
      ...viewState,
      latitude: center.lat,
      longitude: center.lng
    });
  }





  return (
    <MapContext.Provider value={{
      viewState,
      markers,
      mapRef,
      selectedLake,
      setViewState,
      onMarkerClick: handleMarkerClick,
      onMove: handleMove,
      onLoad: handleLoad
    }}>
      {children}
    </MapContext.Provider>
  );
}

// export const useMap = () => {
//   const context = useContext(MapContext);
//   if (!context) {
//     throw new Error('useMap must be used within a MapProvider');
//   }
//   return context;
// }


const fetchLakeMarkers = async ({ lat, lng }: { lat: number, lng: number }) => {
  const url = `http://localhost:8080/api/v1/lakes/markers?lat=${lat}&lng=${lng}`;
  const res = await axios.get(url);
  return res.data;
}

const fetchLakeDetails = async (id: string): Promise<Lake> => {
  const url = `http://localhost:8080/api/v1/lakes/${id}`;
  const res = await axios.get(url);
  const fishRes = await axios.get(res.data.fishUrl);
  delete res.data.fishUrl;
  return {
    ...res.data,
    fish: fishRes.data
  }
}

export interface MapContextType {
  viewState: ViewState;
  markers: Lake[];
  mapRef: React.MutableRefObject<MapRef | null>;
  selectedLake: Lake | null;
  setViewState: React.Dispatch<React.SetStateAction<ViewState>>;
  onMarkerClick: (lake: Lake) => void;
  onMove: (e: ViewStateChangeEvent) => void;
  onLoad: (center: { lat: number, lng: number }) => void;
}

type ViewState = {
  latitude: number;
  longitude: number;
  zoom: number;
}

