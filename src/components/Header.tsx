import useAuth from "../contexts/AuthContext/useAuth";
import SearchBar from "./SearchBar";
import { NavLink } from "react-router-dom";
import LoginNavLink from "./LoginNavLink";
import { MouseEvent } from "react";


const Header = () => {
  const { isAuthorized, logout } = useAuth();


  function handleLogout(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    logout();
  }

  return (
    <header className="px-2 py-2 flex items-center bg-amber-500/80 text-lime-950 text-lg font-semibold">
      <div className="flex items-center mr-auto">LOGO HERE</div>
      <div className="mx-auto flex gap-4">
        <SearchBar />
      </div>
      <nav className="ml-auto">
        <ul className="flex gap-2 uppercase">
          <li>
            {isAuthorized ? (
              <NavLink
                to="/logout"
                className=""
                onClick={handleLogout}
              >
                Logout
              </NavLink>
            ) : (
              <LoginNavLink />
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
