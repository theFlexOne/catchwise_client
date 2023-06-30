import { useContext } from "react";
import { MapContext } from "./MapContext";

const useMap = () => {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error('useMap must be used within a MapProvider');
  return ctx;
}

export default useMap;