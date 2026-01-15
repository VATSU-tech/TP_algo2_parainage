import { NavLink } from "react-router-dom";
import Avatar from "./Avatar";

export default function Navbar() {
  return (
    <header className="w-full">
      <nav>
        <ul className="flex text-center justify-between bg-gray-400 border-gray-500 px-4 py-2 rounded-2xl">
          <li>
            <ul className="flex gap-4 cursor-pointer">
              <li>
                <NavLink
                  to="/"
                  className={(nav) => (nav.isActive ? "nav-active" : "")}
                >
                  Acceuil
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/statistique"
                  className={(nav) => (nav.isActive ? "nav-active" : "")}
                >
                  Reseau
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/gains"
                  className={(nav) => (nav.isActive ? "nav-active" : "")}
                >
                  Gains
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/produits"
                  className={(nav) => (nav.isActive ? "nav-active" : "")}
                >
                  Produits
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/outils"
                  className={(nav) => (nav.isActive ? "nav-active" : "")}
                >
                  Outils
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/formation"
                  className={(nav) => (nav.isActive ? "nav-active" : "")}
                >
                  Formation
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/support"
                  className={(nav) => (nav.isActive ? "nav-active" : "")}
                >
                  Support
                </NavLink>
              </li>
            </ul>
          </li>
          <li>
            <Avatar />
          </li>
        </ul>
      </nav>
    </header>
  );
}
