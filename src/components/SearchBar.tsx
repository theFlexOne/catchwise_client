import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import useMap from "../contexts/MapContext/useMap"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import LakeNameObject from "../types/LakeName";

const SearchBar = ({ value, label, onChange, onSearch }: SearchBarProps) => {
  const [lakeNamesList, setLakeNamesList] = useState<LakeNameObject[]>([]);
  const { fetchLakeNames } = useMap();

  useEffect(() => {
    if (lakeNamesList.length) return;
    const controller = new AbortController();
    console.log("fetching lake names");
    async function fetch() {
      const lakeNames: LakeNameObject[] | undefined = await fetchLakeNames({ signal: controller.signal });
      if (!lakeNames) return;
      setLakeNamesList(lakeNames);
    }
    try {
      fetch();
      // eslint-disable-next-line no-empty
    } catch (err) { }
    return () => controller.abort();
  }, [lakeNamesList.length, fetchLakeNames]);

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const inputElement = e.currentTarget.elements[0] as HTMLInputElement;
    const datalistElement = document.getElementById("lakeNames") as HTMLDataListElement;

    console.log(e.target);
    console.log(inputElement);
    console.log(datalistElement);
  }

  return (
    <form onSubmit={handleSubmit}>
      {label &&
        <label
          htmlFor="searchInput"
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>}
      <input
        type="text"
        id="searchInput"
        value={value}
        onChange={e => onChange(e)}
        className="rounded px-2 py-1 text-sm"
        placeholder="Search for a lake"
        list="lakeNames"
      />
      <button onClick={onSearch}>
        <MagnifyingGlassIcon className="w-5 h-5" />
      </button>
      <datalist id="lakeNames">
        {lakeNamesList.map((lake) => (
          <option
            key={lake.id}
            value={lake.name}
            data-lake-id={lake.id}
            className="capitalize"
          />
        ))}
      </datalist>
    </form>
  )
}

type SearchBarProps = {
  value: string,
  label?: string,
  onChange: (e: ChangeEvent<HTMLInputElement>) => void,
  onSearch: () => void
}

export default SearchBar