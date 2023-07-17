import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import useMap from "../contexts/MapContext/useMap"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { LocationName } from "../contexts/MapContext/MapContext";


const SearchBar = () => {
  const [value, setValue] = useState<string>("");
  const [locationNames, setLocationNames] = useState<LocationName[]>([]);
  const { fetchLocationNames, onSearch } = useMap();

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    try {
      const datalistElement = document.getElementById("names") as HTMLDataListElement;
      const option: HTMLOptionElement | null = datalistElement.querySelector(`option[value="${value}"]`);
      const lakeId = option?.dataset.id;
      if (!lakeId) throw new Error("No lake id found");

      onSearch && onSearch(+lakeId);
    } catch (err) {
      console.log(err);
    }
  }

  function handleSearchbarChange(e: ChangeEvent<HTMLInputElement>): void {
    throw new Error("Function not implemented.");
  }

  console.log(locationNames);


  return (
    <form
      className="flex items-center justify-center gap-2"
      onSubmit={handleSubmit}>
      <input
        type="text"
        id="searchInput"
        value={value}
        onChange={handleSearchbarChange}
        className="rounded px-2 py-1 text-sm"
        placeholder="Search for a lake"
        list="names"
      />
      <button
        className="rounded-full p-1 bg-gray-100 hover:bg-gray-300 transition-colors shadow-md">
        <MagnifyingGlassIcon className="w-5 h-5 stroke-[2px] stroke-zinc-900" />
      </button>
      <datalist id="names">
        {locationNames.length && locationNames.sort((a, b) => a.name.localeCompare(b.name))
          .map((lake) => (
            <option
              key={lake.id}
              value={lake.name}
              data-lake-id={lake.id}
              className="capitalize"
            />
          ))}
      </datalist>
    </form >
  )
}

type SearchBarProps = {
  value: string,
  label?: string,
  onChange: (e: ChangeEvent<HTMLInputElement>) => void,
  onSearch: (id: string) => void
}

export default SearchBar