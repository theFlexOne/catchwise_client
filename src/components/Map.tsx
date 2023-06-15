import { GoogleMap } from "@react-google-maps/api";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import LakeMarker from "./LakeMarker";
import { Lake } from "../types/Lake";
import MapSearchBar from "./MapSearchBar";
import useMap from "../hooks/useMap";
import { useSettings } from "../hooks/useSettings";

const mapOptions: MapOptions = {
  mapId: "45aff3ba656e7008",
  disableDefaultUI: true,
};

export default function Map({ center, zoom = 14 }: MapProps) {
  const [selectedLake, setSelectedLake] = useState<Lake | null>(null);
  const centerRef = useRef<LatLngLiteral>(center);
  const { lakes, onLoad, isLoaded, loadError } = useMap(center);

  const { minZoom, maxZoom } = useSettings();

  mapOptions.minZoom = minZoom;
  mapOptions.maxZoom = maxZoom;


  function handleMarkerClick(lake: Lake) {
    return () => setSelectedLake(lake);
  }

  if (loadError) return <div>Error loading map. Try refreshing the page?</div>;

  return isLoaded ? (
    <div className="relative h-full mx-auto">
      <GoogleMap
        mapContainerStyle={{
          position: "absolute",
          inset: 0,
        }}
        options={mapOptions}
        center={centerRef.current}
        zoom={zoom}
        onLoad={onLoad}
      >
        {lakes.map((lake) => (
          <LakeMarker
            key={lake.id}
            lake={lake}
            onClick={handleMarkerClick(lake)}
            isSelected={selectedLake?.id === lake.id}
          />
        ))}
      </GoogleMap>
      <MapSearchBar
        className="absolute z-10 top-4 right-0"
      />
    </div>
  ) : (
    <div>Loading...</div>
  );
}





type MapProps = {
  center: LatLngLiteral;
  zoom?: number;
};
type LatLngLiteral = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;
