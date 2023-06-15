import { Marker, InfoWindow } from "@react-google-maps/api";
import axios from "axios";
import { useState } from "react";
import { Lake } from "../types/Lake";
import useGoogleApi from "../hooks/useGoogleApi";
import { Fish } from "../types/Fish";

const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;

interface LakeMarkerProps {
  lake: Lake;
  children?: React.ReactNode;
  onClick?: () => void;
  isSelected?: boolean;
}

const LakeMarker = ({ onClick, lake, isSelected }: LakeMarkerProps) => {
  const [fishList, setFishList] = useState<Fish[] | null>(null);

  const handleMarkerClick = async () => {
    if (onClick) onClick();

    if (fishList == null) {
      const fishList = await fetchLakeFishList(lake);
      setFishList(fishList);
    }
  };

  return (
    <Marker
      key={lake.id}
      position={{
        lat: lake.coordinates.longitude,
        lng: lake.coordinates.latitude,
      }}
      onClick={handleMarkerClick}
    >
      {fishList?.length && isSelected && (
        <InfoWindow>
          <div className="capitalize">
            <h2 className="text-2xl font-semibold mb-2">{lake.name}</h2>
            <ul className="flex flex-col gap-2 px-2 font-medium tracking-wide">
              {fishList.map((fish) => (
                <li key={fish.id}>{fish.name}</li>
              ))}
            </ul>
          </div>
        </InfoWindow>
      )}
    </Marker>
  );
};

async function fetchLakeFishList(lake: Lake) {
  const url = `${SERVER_URL}/api/v1/lakes/${lake.id}/fish`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export default LakeMarker;
