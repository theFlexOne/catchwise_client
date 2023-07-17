import { createContext, useEffect, useRef, useState } from 'react';
import LakeMarker from '../../types/LakeMarker';
import { LngLatBounds, MapboxEvent, ViewState, ViewStateChangeEvent } from 'react-map-gl';
import Lake from '../../types/Lake';
import { MapRef } from 'react-map-gl';
import { point, inside, bboxPolygon } from '@turf/turf';
import axios, { CanceledError } from 'axios';
import useUserLocation from '../../hooks/useUserLocation';

type MapProviderProps = {
  children: React.ReactNode,
}
type MapContextType = {
  lakeMarkers: LakeMarker[];
  mapRef: React.MutableRefObject<any>;
  currentLake: Lake | null;
  initialViewState: ViewState;
  fetchLakeMarkers: (coords: [number, number], options?: Options) => void;
  fetchLocationNames: () => Promise<LocationName[]>;
  onMove?: (event: ViewStateChangeEvent) => void;
  onMarkerClick: (id: number) => void;
  onSearch?: (lakeId: number) => void;
  onLoad?: (event: MapboxEvent) => void;
}
type Options = {
  signal?: AbortSignal | undefined;
  headers?: {
    Authorization?: string | undefined;
  };
  [key: string]: unknown;
}

export type LocationName = {
  id: number;
  name: string;
  county: string;
  state: string;
}


const zoom = {
  MIN: 0,
  MAX: 15,
  INITIAL: 10,
}

export const MapContext = createContext<MapContextType | null>(null);

export const MapProvider = ({ children }: MapProviderProps) => {
  const [coords] = useUserLocation();
  const [lakeMarkers, setLakeMarkers] = useState<LakeMarker[]>([]);
  const [currentLake, setCurrentLake] = useState<Lake | null>(null);
  const [bounds, setBounds] = useState<LngLatBounds | null>(null);

  const mapRef = useRef<MapRef | null>(null);

  const initialViewState: ViewState = {
    longitude: coords?.[0] || 0,
    latitude: coords?.[1] || 0,
    zoom: zoom.INITIAL,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  };


  const onMove = (event: ViewStateChangeEvent): void => {
    const newBounds = event.target.getBounds();
    setBounds(newBounds);
  };
  const onLoad = (event: MapboxEvent): void => {
    const map = event.target;
    setBounds(map.getBounds());
  };
  const onMarkerClick = (id: number) => {
    fetchLakeInfo(id).then(lakeInfo => {
      if (!lakeInfo) throw new Error("Lake info not found");
      setCurrentLake(lakeInfo)
    }).catch(error => {
      console.error(error);
    });
  };
  const onSearch = (lakeId: number) => {
    console.log(lakeId);
  };


  const fetchLakeMarkers = async (coords: [number, number], options: Options = {}): Promise<void> => {
    const url = new URL("http://localhost:8080/api/v1/markers");
    url.searchParams.append("lng", coords[0].toString());
    url.searchParams.append("lat", coords[1].toString());
    url.searchParams.append("radius", "3");

    try {
      const response = await axios.get(url.toString(), options)
      const newLakeMarkers = response.data;
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
  async function fetchLakeInfo(lakeId: number): Promise<Lake | undefined> {
    const url = new URL(`http://localhost:8080/api/v1/lakes/${lakeId}`);
    try {
      const response = await axios.get(url.toString());
      return response.data;
    } catch (error) {
      if (error instanceof CanceledError) return;
      console.error(error);
    }
  }

  async function fetchLocationNames(): Promise<LocationName[]> {
    const url = new URL("http://localhost:8080/api/v1/location-names");
    try {
      const response = await axios.get(url.toString());
      return response.data as LocationName[];
    } catch (error) {
      if (error instanceof CanceledError) return [];
      console.error(error);
      return [];
    }
  }



  const currentLakeMarkers = (() => {
    if (!bounds) return [];
    const bbox = bboxPolygon(bounds.toArray().flat());
    if (!bbox) return [];
    return lakeMarkers.filter((marker) => {
      const markerPoint = point(marker.coordinates);
      return inside(markerPoint, bbox);
    });
  })()

  useEffect(() => {
    if (!coords) return;
    fetchLakeMarkers([coords[0], coords[1]]);
  }, [coords]);

  lakeMarkers.length > 0 && console.log(lakeMarkers);

  return coords && (
    <MapContext.Provider value={{
      lakeMarkers: currentLakeMarkers,
      fetchLakeMarkers,
      fetchLocationNames,
      mapRef,
      initialViewState,
      currentLake,
      onMove,
      onLoad,
      onMarkerClick,
      onSearch,
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

