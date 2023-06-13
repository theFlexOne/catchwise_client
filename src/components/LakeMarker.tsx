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
  const [lakeName, setLakeName] = useState<string | null>(null);

  const { searchForPlace } = useGoogleApi();

  const handleMarkerClick = async () => {
    if (onClick) onClick();

    if (fishList == null) {
      const fishList = await fetchLakeFishList(lake);
      setFishList(fishList);
    }

    if (lakeName == null) {
      const cleanLakeName = lake.name
        .split(" ")
        .filter((w) => !w.match(/[()]/))
        .join(" ");
      const searchData = await searchForPlace(`"${cleanLakeName} lake"`);
      console.log(searchData);
      let name = (searchData?.candidates[0]?.name as string) || "";
      if (!name.match(/lake/i)) name = lake.name;

      setLakeName(name);
    }
  };

  return (
    <Marker
      key={lake.id}
      position={{
        lat: lake.coordinates.latitude,
        lng: lake.coordinates.longitude,
      }}
      onClick={handleMarkerClick}
    >
      {fishList?.length && isSelected && (
        <InfoWindow>
          {lakeName ? (
            <div className="capitalize">
              <h2 className="text-2xl font-semibold mb-2">{lakeName}</h2>
              <ul className="flex flex-col gap-2 px-2 font-medium tracking-wide">
                {fishList.map((fish) => (
                  <li key={fish.id}>{fish.name}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="capitalize">
              <div className="bg-neutral-500 rounded-sm w-[20ch] h-4 mb-2 px-4 transition-opacity" />
              <ul className="flex flex-col gap-2 px-2 font-medium tracking-wide">
                {fishList.map((fish) => (
                  <li key={fish.id}>{fish.name}</li>
                ))}
              </ul>
            </div>
          )}
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
