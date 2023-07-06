import { LngLat, LngLatLike } from "mapbox-gl";

type LakeMarker = {
  lakeId: number;
  lakeName: string;
  coordinates: [number, number];
  distance?: number;
}

export default LakeMarker;