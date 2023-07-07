import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios, { CanceledError } from 'axios';
import LakeMarker from '../../types/LakeMarker';
import { ViewState, ViewStateChangeEvent } from 'react-map-gl';
import { LngLatLike, Map } from 'mapbox-gl';
import Lake from '../../types/Lake';
import LakeNameObject from '../../types/LakeName';
import useLakes from '../../hooks/useLakes';

const zoom = {
  MIN: 0,
  MAX: 15,
  current: 10,
}

export const MapContext = createContext<MapContextType | null>(null);

export const MapProvider = ({ children, coords }: MapProviderProps) => {
  const [viewState, setViewState] = useState<ViewState>({
    latitude: coords?.lat || 0,
    longitude: coords?.lng || 0,
    zoom: zoom.current,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  const [currentLake, setCurrentLake] = useState<Lake | null>(null);

  const [currentCell, setCurrentCell] = useState<string>([
    Math.floor(viewState.longitude),
    Math.floor(viewState.latitude)
  ].join(":"));

  const [scrollCenter, setScrollCenter] = useState<[number, number]>([viewState.longitude, viewState.latitude]);

  const mapRef = useRef<Map | null>(null);

  const { lakeMarkers, fetchLakeMarkers, fetchLakeInfo } = useLakes([viewState.longitude, viewState.latitude]);

  const onMove = (event: ViewStateChangeEvent): void => {
    const newCenter: [number, number] = [event.viewState.longitude, event.viewState.latitude]

    const cell = [Math.floor(newCenter[0]), Math.floor(newCenter[1])].join(":");
    const scrollDistance = calculateDistance(scrollCenter, newCenter);

    if (cell !== currentCell && scrollDistance > 1000) {
      console.log("Fetching new markers");
      console.log("Drawing markers");
      setCurrentCell(cell);
      setScrollCenter(newCenter);
      fetchLakeMarkers(newCenter);
    } else if (scrollDistance > 10000) {
      console.log("Redrawing markers");
      setScrollCenter(newCenter);
    }
    setViewState(event.viewState);

  };

  const onMarkerClick = (marker: LakeMarker): void => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({
      center: marker.coordinates,
      zoom: 13,
      speed: 1,
      curve: 2,
    });
    fetchLakeInfo(marker.id);

  };

  const onSearch = (lakeId: number): void => {
    const marker = lakeMarkers.find((marker) => marker.id === lakeId);
    if (!marker) return;
    onMarkerClick(marker);
  };

  useEffect(() => {
    const controller = new AbortController();
    const options: Options = { signal: controller.signal };

    if (!coords) return;
    fetchLakeMarkers([coords.lng, coords.lat], options);
    return () => {
      controller.abort();
    };
  }, []);



  const currentLakeMarkers = lakeMarkers.filter((marker) => {
    // console.log("Marker Coords: ", marker);
    // console.log("Scroll Center: ", scrollCenter);
    const distance = calculateDistance(marker.coordinates, scrollCenter);
    // console.log("Distance: ", distance);

    return distance < 50000;
  });

  const zoomState = useMemo(() => ({
    ...zoom,
    current: viewState.zoom
  }), [viewState.zoom]);

  return (
    <MapContext.Provider value={{
      lakeMarkers: currentLakeMarkers,
      fetchLakeMarkers,
      mapRef,
      viewState,
      currentLake,
      zoomState,
      onMove,
      onMarkerClick,
      onSearch
    }}>
      {children}
    </MapContext.Provider >
  );
}

function getDistanceFromLngLatInMiles([lng1, lat1]: number[], [lng2, lat2]: number[]): number {
  function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceInKm = R * c; // Distance in km
  const distanceInMiles = distanceInKm * 0.621371; // Convert to miles

  return distanceInMiles;
}

function calculateDistance([lng1, lat1]: number[], [lng2, lat2]: number[]): number {
  const R = 6371e3; // Radius of the Earth in meters
  const φ1 = lat1 * (Math.PI / 180); // Convert degrees to radians
  const φ2 = lat2 * (Math.PI / 180);
  const Δφ = (lat2 - lat1) * (Math.PI / 180);
  const Δλ = (lng2 - lng1) * (Math.PI / 180);

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in meters
  return distance;
}

type MapProviderProps = {
  children: React.ReactNode,
  coords?: { lat: number, lng: number }
}


type MapContextType = {
  lakeMarkers: LakeMarker[];
  mapRef: React.MutableRefObject<any>;
  viewState: ViewState;
  currentLake: Lake | null;
  zoomState: typeof zoom;
  fetchLakeMarkers: (coords: [number, number], options?: Options) => void;
  onMove: (event: ViewStateChangeEvent) => void;
  onMarkerClick: (marker: LakeMarker) => void;
  onSearch: (lakeId: number) => void;
}

type Options = {
  signal?: AbortSignal | undefined;
  [key: string]: any;
}

