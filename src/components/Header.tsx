/// <reference types="vite-plugin-svgr/client" />

import useAuth from "../contexts/AuthContext/useAuth";
import { Link, useLocation } from "react-router-dom";
import { ReactComponent as LogoSVG } from '../assets/logo2.svg';
import HeaderNavLink from "./HeaderNavLink";


const Header = () => {
  const { isLoggedIn, logout } = useAuth();
  const { pathname } = useLocation();

  const isLoginPath = pathname === "/login";
  const isSignupPath = pathname === "/signup";

  return (
    <header className="flex justify-center bg-amber-500 text-lime-950 text-lg font-semibold h-20 px-8">
      <div className="max-w-screen-xl flex py-3 grow items-center">
        <Link to="/">
          <LogoSVG className="h-14 w-14" />
        </Link>
        <nav className="mx-auto text-white flex justify-center grow">
          <Link to="/map">map</Link>
        </nav>
        <div className="ml-auto">
          {isLoggedIn ? (
            <HeaderNavLink
              to="/"
              className=""
              onClick={logout}
            >
              logout
            </HeaderNavLink>
          ) : (
            <div className="flex gap-4">
              {!isLoginPath && <Link
                to="/login"
                className="text-lg font-semibold px-2 py-1 rounded bg-zinc-300/0 hover:bg-zinc-300/30 transition-all duration-2000"
                state={{ redirectPath: pathname }}
              >log in</Link>}
              {!isSignupPath && <Link
                to="/signup"
                className="text-lg font-semibold bg-sky-600 rounded px-2 py-1 text-white hover:bg-sky-700 transition-colors duration-200"
                state={{ redirectPath: pathname }}
              >create account</Link>}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
