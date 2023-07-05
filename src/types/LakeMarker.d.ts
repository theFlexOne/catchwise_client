import { LngLat, LngLatLike } from "mapbox-gl";

type LakeMarker = {
  lakeId: number;
  lakeName: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  distance: number;
}

export default LakeMarker;