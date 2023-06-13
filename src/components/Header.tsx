interface Link {
  url: string;
  label: string;
}

interface HeaderProps {
  links: Link[];
}

const Header: React.FC<HeaderProps> = ({ links }) => {
  return (
    <header className="px-2 py-4 flex items-center bg-amber-500/80 text-lime-950 text-lg font-semibold">
      <div className="h-12 flex items-center mr-auto">LOGO HERE</div>
      <nav>
        <ul className="flex gap-2 uppercase">
          {links.map(({ url, label }) => (
            <li key={crypto.getRandomValues(new Uint32Array(1))[0]}>
              <a href={url}>{label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
