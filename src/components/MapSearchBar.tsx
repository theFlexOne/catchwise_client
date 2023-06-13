import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import capitalize from "../helpers/capitalize";

const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;

export default function MapSearchBar({
  className = "",
  onSubmit,
}: MapSearchBarProps) {
  const [searchInput, setSearchInput] = useState("");

  const lakeNamesList = useRef<{ id: number; name: string }[]>([]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchInput(e.target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!onSubmit) return;
    onSubmit(searchInput);
  }
  useEffect(() => {
    if (lakeNamesList.current.length) return;
    async function fetchLakeNames() {
      try {
        const response = await axios(`${SERVER_URL}/api/v1/lakes/names`);
        lakeNamesList.current = response.data;
      } catch (error) {
        console.warn("Failed to fetch lake names");
      }
    }
    fetchLakeNames();
  }, []);

  return (
    <>
      <form
        className={twMerge(
          className,
          "flex gap-2 p-2 rounded bg-neutral-400/70 items-center"
        )}
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          id="mapSearchBar"
          list="lakeNames"
          value={searchInput}
          onChange={handleInputChange}
          className="rounded px-2 py-1 text-sm"
        />
        <button
          type="submit"
          className="flex items-center hover:scale-125 transition"
        >
          <span className="material-symbols-outlined text-white text-2xl">
            search
          </span>
        </button>
      </form>
      <LakeNamesList lakeNamesList={lakeNamesList} />
    </>
  );
}

function LakeNamesList({
  lakeNamesList,
}: {
  lakeNamesList: React.MutableRefObject<{ id: number; name: string }[]>;
}) {
  return (
    <datalist id="lakeNames">
      {lakeNamesList.current
        .sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name === b.name) return 0;
          return 1;
        })
        .map((lake) => (
          <option
            key={lake.id}
            value={capitalize(lake.name ?? "")}
            className="capitalize"
          />
        ))}
    </datalist>
  );
}

interface MapSearchBarProps {
  onSubmit?: (searchInput: string) => void;
  className?: string;
}
