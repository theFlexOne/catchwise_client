import { LngLat, LngLatLike } from "mapbox-gl";

type LakeMarker = {
  id: number;
  name: string;
  coordinates: [number, number];
}

export default LakeMarker;