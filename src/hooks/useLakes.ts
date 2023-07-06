import { useState, useEffect } from 'react';
import axios, { CanceledError } from 'axios';
import LakeNameObject from '../types/LakeName';
import LakeMarker from '../types/LakeMarker';

type Options = {
  signal?: AbortSignal | undefined;
  [key: string]: any;
}

const useLakes = (initialCenter: [number, number]) => {
  const [lakeMarkers, setLakeMarkers] = useState<LakeMarker[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  async function fetchLakes(center: [number, number], options: Options = {}) {
    setIsLoading(true);
    try {
      const markers: LakeMarker[] | undefined = await fetchLakeMarkers(center, options);
      if (markers) {
        setLakeMarkers(markers);
      }
    } catch (error) {
      if (error instanceof CanceledError) return;
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }


  useEffect(() => {
    const controller = new AbortController();
    const options: Options = { signal: controller.signal };

    fetchLakes(initialCenter, options);
    return () => {
      controller.abort();
    };
  }, [initialCenter]);

  return { lakeMarkers, isLoading, error, fetchLakeMarkers, fetchLakeInfo };

};

async function fetchLakeMarkers(coords: [number, number], options: Options = {}): Promise<LakeMarker[] | undefined> {
  const url = new URL("http://localhost:8080/api/v1/lakes/markers");
  url.searchParams.append("lng", coords[0].toString());
  url.searchParams.append("lat", coords[1].toString());

  try {
    const response = await axios.get(url.toString(), options);
    console.log(response.data);
    const markers: LakeMarker[] = response.data.map((markerJson: any) => {
      const coordinates: [number, number] = [markerJson.lng, markerJson.lat];
      return {
        lakeId: markerJson.lakeId,
        coordinates,
        lakeName: markerJson.lakeName,
      };
    });

    console.log("markers", markers);

    return markers;
  } catch (error) {
    if (error instanceof CanceledError) return;
    console.error(error);
    return undefined;
  }
}

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


