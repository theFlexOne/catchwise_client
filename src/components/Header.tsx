import { useState } from "react";
import SearchBar from "./SearchBar";

interface Link {
  url: string;
  label: string;
}

interface HeaderProps {
  links: Link[];
}

const Header: React.FC<HeaderProps> = ({ links }) => {


  return (
    <header className="px-2 py-2 flex items-center bg-amber-500/80 text-lime-950 text-lg font-semibold">
      <div className="flex items-center mr-auto">LOGO HERE</div>
      <div className="mx-auto flex gap-4">
        <SearchBar />
      </div>
      <nav className="ml-auto">
        <ul className="flex gap-2 uppercase">
          {links.map(({ url, label }) => (
            <li key={url}>
              <a href={url}>{label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
