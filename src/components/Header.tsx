import useAuth from "../contexts/AuthContext/useAuth";
import { NavLink } from "react-router-dom";
import LoginNavLink from "./LoginNavLink";
import { MouseEvent } from "react";
import Logo from './Logo';


const Header = () => {
  const { isLoggedIn, logout } = useAuth();


  function handleLogout(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    logout();
  }

  return (
    <header className="px-8 py-3 flex items-center bg-amber-500 text-lime-950 text-lg font-semibold uppercase h-20">
      <div className="flex items-center mr-auto max-h-full">
        <Logo />
      </div>
      <nav className="ml-auto">
        <div>
          {isLoggedIn ? (
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
        </div>
      </nav>
    </header>
  );
};

export default Header;
