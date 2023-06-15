/* eslint-disable react-refresh/only-export-components */
import { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";
import { Lake } from "../types/Lake";

const LAKES_ENDPOINT = "http://localhost:8080/api/v1/lakes";


const LakesContext = createContext({
  lakes: [],
  error: null,
} as LakesProviderValue);

const LakesProvider = ({ children }: { children: React.ReactNode }) => {
  const [lakes, setLakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchLakes = async () => {
      try {
        const response = await axios.get(LAKES_ENDPOINT, {
          signal: controller.signal,
        });
        setLakes(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLakes();
    return () => controller.abort();
  }, []);



  return (
    <LakesContext.Provider value={{lakes, error}}>
      {loading ? <div>Loading...</div> : children}
    </LakesContext.Provider>
  );
};

const useLakes = () => {
  const context = useContext(LakesContext);
  if (context === undefined) {
    throw new Error("useLakes must be used within a LakesProvider");
  }
  return context;
}

export { LakesProvider, useLakes };

interface LakesProviderValue {
  lakes: Lake[];
  error: unknown;
}