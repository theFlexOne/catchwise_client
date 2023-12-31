import { createContext, useEffect, useRef, useState } from 'react';
import MapMarker from '../../types/MapMarker';
import { LngLatBounds, MapEvent, ViewState, ViewStateChangeEvent } from 'react-map-gl';
import Lake from '../../types/Lake';
import { MapRef } from 'react-map-gl';
import * as turf from '@turf/turf';
import axios, { CanceledError } from 'axios';
import useUserLocation from '../../hooks/useUserLocation';

type MapProviderProps = {
  children: React.ReactNode,
}
type MapContextValue = {
  currentMapMarkers: MapMarker[];
  mapRef: React.MutableRefObject<any>;
  selectedLocation: Lake | null;
  initialViewState: ViewState;
  fetchMarkers: (coords: [number, number], options?: Options) => void;
  fetchLocationNames: () => Promise<LocationName[]>;
  onMove?: (event: ViewStateChangeEvent) => void;
  onMarkerClick: (id: number) => void;
  onSearch?: (lakeId: number) => void;
  onLoad?: (event: MapEvent) => void;
}
type Options = {
  signal?: AbortSignal | undefined;
  headers?: {
    Authorization?: string | undefined;
  };
  [key: string]: unknown;
}
type LocationName = {
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

export const MapContext = createContext<MapContextValue | null>(null);

const MapProvider = ({ children }: MapProviderProps) => {
  const [coords] = useUserLocation();
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Lake | null>(null);
  const [bounds, setBounds] = useState<LngLatBounds | null>(null);

  const mapRef = useRef<MapRef | null>(null);
  const mapCenter = useRef<[number, number] | null>(null);

  const initialViewState: ViewState = {
    longitude: mapCenter.current?.[0] || coords?.[0] || 0,
    latitude: mapCenter.current?.[1] || coords?.[1] || 0,
    zoom: zoom.INITIAL,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  };


  const onMove = (event: ViewStateChangeEvent): void => {
    const newBounds = event.target.getBounds();
    setBounds(newBounds);
    const center: [number, number] = [event.target.getCenter().lng, event.target.getCenter().lat];
    mapCenter.current = center;
  };
  const onLoad = (event: MapEvent): void => {
    const map = event.target;
    setBounds(map.getBounds());
    const center: [number, number] = [map.getCenter().lng, map.getCenter().lat];
    mapCenter.current = center;
  };
  const onMarkerClick = (id: number) => {
    fetchLocationInfo(id).then(lakeInfo => {
      if (!lakeInfo) throw new Error("Lake info not found");
      setSelectedLocation(lakeInfo)
    }).catch(error => {
      console.error(error);
    });
  };
  const onSearch = (lakeId: number) => {
    console.log(lakeId);
  };


  async function fetchMarkers(coords: [number, number], options: Options = {}): Promise<void> {
    const url = new URL("http://localhost:8080/api/v1/map/markers");
    url.searchParams.append("lng", coords[0].toString());
    url.searchParams.append("lat", coords[1].toString());
    url.searchParams.append("radius", "3");
    url.searchParams.append("fields", "all");
    try {
      const response = await axios.get(url.toString(), options)
      const newLakeMarkers = response.data;
      setMapMarkers(prev => [...prev, ...newLakeMarkers].reduce((acc, cur) => {
        const index = acc.findIndex((marker: MapMarker) => marker.id === cur.id);
        if (index === -1) {
          acc.push(cur);
        }
        return acc;
      }, [] as MapMarker[]));
    } catch (error) {
      if (error instanceof CanceledError) return;
      console.error(error);
    }
  }
  async function fetchLocationInfo(lakeId: number): Promise<Lake | undefined> {
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

  const currentMapMarkers = (() => {
    if (!bounds) return [];
    const bbox = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()];
    const polygon = turf.bboxPolygon(bbox);
    return mapMarkers.filter((marker) => {
      const markerPoint = turf.point(marker.coordinates);
      return turf.inside(markerPoint, polygon);
    });
  })()

  useEffect(() => {
    if (!coords) return;
    fetchMarkers(coords);
    mapRef.current?.setCenter(coords);
  }, [coords]);

  mapMarkers.length > 0 && console.log(mapMarkers);

  return coords && (
    <MapContext.Provider value={{
      currentMapMarkers,
      fetchMarkers,
      fetchLocationNames,
      mapRef,
      initialViewState,
      selectedLocation: selectedLocation,
      onMove,
      onLoad,
      onMarkerClick,
      onSearch,
    }}>
      {children}
    </MapContext.Provider >
  );
}

export default MapProvider;