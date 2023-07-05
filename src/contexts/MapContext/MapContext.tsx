import { createContext, useEffect, useMemo, useRef, useState } from 'react';
import axios, { CanceledError } from 'axios';
import LakeMarker from '../../types/LakeMarker';
import { ViewState, ViewStateChangeEvent } from 'react-map-gl';
import { LngLatLike, Map } from 'mapbox-gl';
import Lake from '../../types/Lake';
import LakeNameObject from '../../types/LakeName';

const zoom = {
  MIN: 0,
  MAX: 15,
  current: 10,
}

export const MapContext = createContext<MapContextType | null>(null);

export const MapProvider = ({ children, coords }: MapProviderProps) => {
  const [lakeMarkers, setLakeMarkers] = useState<LakeMarker[]>([]);
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

  async function fetchLakeMarkers({ lat, lng }: { lat: number, lng: number }, options?: Options) {
    const url = new URL("http://localhost:8080/api/v1/lakes/markers");
    url.searchParams.append("lat", lat.toString());
    url.searchParams.append("lng", lng.toString());
    // url.searchParams.append("fish", "bluegill");

    try {
      const response = await axios.get(url.toString(), options);

      const markers: LakeMarker[] = response.data.map((markerJson: any) => {
        const coordinates: LngLatLike = {
          lat: markerJson.coordinates[1],
          lng: markerJson.coordinates[0],
        };
        return {
          lakeId: markerJson.lakeId,
          coordinates,
          lakeName: markerJson.lakeName,
        };
      });

      console.log("markers", markers);


      setLakeMarkers(markers);
    } catch (error) {
      if (error instanceof CanceledError) return;
      console.error(error);
    }
  }

  async function fetchLakeInfo(lakeId: number) {
    const url = new URL(`http://localhost:8080/api/v1/lakes/${lakeId}`);
    try {
      const response = await axios.get(url.toString());
      console.log(response.data);

      setCurrentLake(response.data);
    } catch (error) {
      if (error instanceof CanceledError) return;
      console.error(error);
    }
  }

  async function fetchLakeNames(options: Options): Promise<LakeNameObject[] | undefined> {
    const url = new URL(`http://localhost:8080/api/v1/lakes/names`);
    url.searchParams.append("lat", viewState.latitude.toString());
    url.searchParams.append("lng", viewState.longitude.toString());
    try {
      const response = await axios.get(url.toString(), options);
      return response.data;
    } catch (error) {
      if (error instanceof CanceledError) return;
      console.error(error);
      return undefined;
    }
  }


  function onMove(event: ViewStateChangeEvent): void {
    const newCenter: [number, number] = [event.viewState.longitude, event.viewState.latitude]

    const cell = [Math.floor(newCenter[0]), Math.floor(newCenter[1])].join(":");
    const scrollDistance = calculateDistance(scrollCenter, newCenter);

    if (cell !== currentCell && scrollDistance > 1000) {
      console.log("Fetching new markers");
      console.log("Drawing markers");
      setCurrentCell(cell);
      setScrollCenter(newCenter);
      fetchLakeMarkers({ lat: event.viewState.latitude, lng: event.viewState.longitude });
    } else if (scrollDistance > 10000) {
      console.log("Redrawing markers");
      setScrollCenter(newCenter);
    }
    setViewState(event.viewState);
  }


  function onMarkerClick(marker: LakeMarker): void {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({
      center: marker.coordinates,
      zoom: 13,
      speed: 1,
      curve: 2,
    });
    fetchLakeInfo(marker.lakeId);
  }

  function onSearch(lakeId: number): void {
    const marker = lakeMarkers.find((marker) => marker.lakeId === lakeId);
    if (!marker) return;
    onMarkerClick(marker);
  }

  useEffect(() => {
    if (!coords) return;
    const controller = new AbortController();
    fetchLakeMarkers(coords, { signal: controller.signal });
    return () => controller.abort();
  }, [coords]);

  // useEffect(() => {
  //   console.log("center:", viewState.latitude, viewState.longitude);
  //   console.log("zoom:", viewState.zoom);
  //   if (!currentLake) return;
  //   console.log(currentLake);
  // }, [currentLake, viewState])


  const currentLakeMarkers = useMemo(() => lakeMarkers.filter((marker) => {
    const distance = calculateDistance(
      [marker.coordinates.lng, marker.coordinates.lat],
      scrollCenter
    );
    return distance < 50000;
  }), [lakeMarkers, scrollCenter]);

  zoom.current = viewState.zoom;

  return (
    <MapContext.Provider value={{
      lakeMarkers: currentLakeMarkers,
      fetchLakeMarkers,
      mapRef,
      viewState,
      currentLake,
      zoom,
      fetchLakeNames,
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
  zoom: typeof zoom;
  fetchLakeMarkers: ({ lat, lng }: { lat: number, lng: number }) => void;
  fetchLakeNames: (options: Options) => Promise<LakeNameObject[] | undefined>;
  onMove: (event: ViewStateChangeEvent) => void;
  onMarkerClick: (marker: LakeMarker) => void;
  onSearch: (lakeId: number) => void;
}

type Options = {
  signal?: AbortSignal | undefined;
  [key: string]: any;
}

