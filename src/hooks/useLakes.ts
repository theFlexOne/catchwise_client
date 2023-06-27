import { useState, useEffect } from "react";
import { Lake } from "../types/Lake";


const useLakes = () => {
  const [lakes, setLakes] = useState<Lake[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLakes = async (center: { lat: number; lng: number; }, range = 50000) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/lakes/markers?lat=${center.lat}&lng=${center.lng}&range=${Math.round(range)}`
      );
      const data = await response.json();
      console.log(data);

      setLakes(data);
    } catch (error: Error | any) {
      setError(error.message);
    }
    setLoading(false);
  }

  return { lakes, loading, error, fetchLakes };
};


export default useLakes;


