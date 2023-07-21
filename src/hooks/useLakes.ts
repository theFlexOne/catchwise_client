import { useState, useCallback } from 'react';
import axios, { CanceledError } from 'axios';
import LakeNameObject from '../types/LakeName';
import MapMarker from '../types/MapMarker';

type Options = {
  signal?: AbortSignal | undefined;
  [key: string]: any;
}

const useLakes = (initialCenter: [number, number]) => {
  const [lakeMarkers, setLakeMarkers] = useState<MapMarker[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  const fetchLakeMarkers = async (coords: [number, number], options: Options = {}): Promise<void> => {
    const url = new URL("http://localhost:8080/api/v1/lakes/markers");
    url.searchParams.append("lng", coords[0].toString());
    url.searchParams.append("lat", coords[1].toString());
    url.searchParams.append("radius", "1");

    setIsLoading(true);

    try {
      const response = await axios.get(url.toString(), options)
      const newLakeMarkers = response.data;
      console.log("Number of new lake markers: ", newLakeMarkers.length);

      const mergedLakeMarkers = [...lakeMarkers, ...newLakeMarkers].reduce((acc, cur) => {
        const index = acc.findIndex((marker: MapMarker) => marker.id === cur.id);
        if (index === -1) {
          acc.push(cur);
        }
        return acc;
      }, [] as MapMarker[]);


      setLakeMarkers(mergedLakeMarkers);
    } catch (error) {
      if (error instanceof CanceledError) return;
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }

  const memoizedFetchLakeMarkers = useCallback(fetchLakeMarkers, [lakeMarkers]);

  return { lakeMarkers, isLoading, error, fetchLakeMarkers: memoizedFetchLakeMarkers, fetchLakeInfo };

};


async function fetchLakeInfo(lakeId: number): Promise<LakeNameObject | undefined> {
  const url = new URL(`http://localhost:8080/api/v1/lakes/${lakeId}`);
  try {
    const response = await axios.get(url.toString());
    return response.data;
  } catch (error) {
    if (error instanceof CanceledError) return;
    console.error(error);
  }
}


export default useLakes;


