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

  async function fetchLakeMarkers(coords: [number, number], options: Options = {}): Promise<LakeMarker[] | undefined> {
    const url = new URL("http://localhost:8080/api/v1/lakes/markers");
    url.searchParams.append("lng", coords[0].toString());
    url.searchParams.append("lat", coords[1].toString());

    setIsLoading(true);
    console.log("fetching lake markers");

    try {
      const response = await axios.get(url.toString(), options)
      const newLakeMarkers = response.data;
      const mergedLakeMarkers = [...lakeMarkers, ...newLakeMarkers].reduce((acc, cur) => {
        const index = acc.findIndex((marker: LakeMarker) => marker.id === cur.id);
        if (index === -1) {
          acc.push(cur);
        }
        return acc;
      }, [] as LakeMarker[]);


      setLakeMarkers(mergedLakeMarkers);
    } catch (error) {
      if (error instanceof CanceledError) return;
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }

  console.log("number of lake markers: ", lakeMarkers.length);


  return { lakeMarkers, isLoading, error, fetchLakeMarkers, fetchLakeInfo };

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


