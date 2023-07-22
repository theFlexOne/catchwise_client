/// <reference types="vite-plugin-svgr/client" />

import useAuth from "../contexts/AuthContext/useAuth";
import { NavLink } from "react-router-dom";
import LoginNavLink from "./LoginNavLink";
import { ReactComponent as LogoSVG } from '../assets/logo.svg';
import { MouseEvent, useState } from 'react';
import HeaderNavLink, { HeaderNavLinkProps } from "./HeaderNavLink";


const Header = () => {
  const [headerNavLinks, setHeaderNavLinks] = useState<HeaderNavLinkProps[]>([]);

  const { isLoggedIn, logout } = useAuth();

  return (
    <header className="px-8 py-3 flex items-center bg-amber-500 text-lime-950 text-lg font-semibold uppercase h-20">
      <LogoSVG className="h-14 w-14" />
      <nav className="ml-auto">
        <div>
          {isLoggedIn ? (
            <HeaderNavLink
              to="/"
              className=""
              onClick={() => logout()}
            >
              logout
            </HeaderNavLink>
          ) : (
            <LoginNavLink />
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
