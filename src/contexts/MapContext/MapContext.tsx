import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import LakeMarker from '../../types/LakeMarker';
import { LngLatBounds, MapboxEvent, ViewState, ViewStateChangeEvent } from 'react-map-gl';
import Lake from '../../types/Lake';
import useLakes from '../../hooks/useLakes';
import { MapRef } from 'react-map-gl';
import { point, distance, inside, bboxPolygon } from '@turf/turf';
import axios, { CanceledError } from 'axios';

const zoom = {
  MIN: 0,
  MAX: 15,
  current: 10,
}


export const MapContext = createContext<MapContextType | null>(null);

export const MapProvider = ({ children, coords }: MapProviderProps) => {
  const [lakeMarkers, setLakeMarkers] = useState<LakeMarker[]>([]);
  const [currentLake, setCurrentLake] = useState<Lake | null>(null);
  const [bounds, setBounds] = useState<LngLatBounds | null>(null);

  const mapRef = useRef<MapRef | null>(null);

  const onMove = (event: ViewStateChangeEvent): void => {
    const newBounds = event.target.getBounds();
    setBounds(newBounds);
  };


  // const onMarkerClick = (marker: LakeMarker): void => {
  //   const map = mapRef.current;
  //   if (!map) return;
  //   map.flyTo({
  //     center: marker.coordinates,
  //     zoom: 13,
  //     speed: 1,
  //     curve: 2,
  //   });
  //   fetchLakeInfo(marker.id);

  // };

  // const onSearch = (lakeId: number): void => {
  //   const marker = lakeMarkers.find((marker) => marker.id === lakeId);
  //   if (!marker) return;
  //   onMarkerClick(marker);
  // };


  const fetchLakeMarkers = async (coords: [number, number], options: Options = {}): Promise<void> => {
    const url = new URL("http://localhost:8080/api/v1/lakes/markers");
    url.searchParams.append("lng", coords[0].toString());
    url.searchParams.append("lat", coords[1].toString());
    url.searchParams.append("radius", "10");

    try {
      const response = await axios.get(url.toString(), options)
      const newLakeMarkers = response.data;
      console.log("Number of new lake markers: ", newLakeMarkers.length);

      setLakeMarkers(prev => [...prev, ...newLakeMarkers].reduce((acc, cur) => {
        const index = acc.findIndex((marker: LakeMarker) => marker.id === cur.id);
        if (index === -1) {
          acc.push(cur);
        }
        return acc;
      }, [] as LakeMarker[]));
    } catch (error) {
      if (error instanceof CanceledError) return;
      console.error(error);
    }
  }

  const currentLakeMarkers = (() => {
    const bbox = bounds ? bboxPolygon([bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()]) : null;
    if (!bbox) return [];
    return lakeMarkers.filter((marker) => {
      const markerPoint = point(marker.coordinates);
      return inside(markerPoint, bbox);
    });
  })()

  console.log(mapRef.current?.getZoom());

  console.log("Number of current lake markers: ", currentLakeMarkers.length);


  const initialViewState: ViewState = useMemo(() => ({
    latitude: coords?.lat || 0,
    longitude: coords?.lng || 0,
    zoom: zoom.current,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  }), [coords?.lat, coords?.lng]);


  useEffect(() => {
    fetchLakeMarkers([initialViewState.longitude, initialViewState.latitude]);
  }, [initialViewState.latitude, initialViewState.longitude]);



  return (
    <MapContext.Provider value={{
      lakeMarkers: currentLakeMarkers,
      fetchLakeMarkers,
      mapRef,
      initialViewState,
      currentLake,
      onMove,
      // onMarkerClick,
      // onSearch
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
  currentLake: Lake | null;
  initialViewState: ViewState;
  fetchLakeMarkers: (coords: [number, number], options?: Options) => void;
  onMove?: (event: ViewStateChangeEvent) => void;
  onMarkerClick?: (marker: LakeMarker) => void;
  onSearch?: (lakeId: number) => void;
  onLoad?: (event: MapboxEvent) => void;
}

type Options = {
  signal?: AbortSignal | undefined;
  [key: string]: any;
}

