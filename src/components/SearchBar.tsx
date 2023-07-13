import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import useMap from "../contexts/MapContext/useMap"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"


const SearchBar = () => {
  const [value, setValue] = useState<string>("");
  const { lakeMarkers, onSearch } = useMap();

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

  console.log(lakeMarkers);




  return (
    <form
      className="flex items-center justify-center gap-2"
      onSubmit={handleSubmit}>
      <input
        type="text"
        id="searchInput"
        value={value}
        onChange={e => setValue(e.target.value)}
        className="rounded px-2 py-1 text-sm"
        placeholder="Search for a lake"
        list="names"
      />
      <button
        className="rounded-full p-1 bg-gray-100 hover:bg-gray-300 transition-colors shadow-md">
        <MagnifyingGlassIcon className="w-5 h-5 stroke-[2px] stroke-zinc-900" />
      </button>
      <datalist id="names">
        {lakeMarkers.length && lakeMarkers.sort((a, b) => a.name.localeCompare(b.name))
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