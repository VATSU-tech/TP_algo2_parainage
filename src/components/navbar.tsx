import { NavLink } from "react-router-dom";
import Avatar from "./Avatar";

export default function Navbar() {
  return (
    <header className="w-full mb-3.5">
      <nav>
        <ul className="flex text-center justify-between bg-gray-200 border-gray-500 px-4 items-center py-2 rounded-2xl">
          <li>
            <ul className="flex gap-4 cursor-pointer">
              <li>
                <NavLink
                  to="/"
                  className={(nav) => (nav.isActive ? "button active" : "button")}
                >
                  <button className="button" >
                    <svg>
                      <rect className="border" pathLength="100"></rect> 
                    </svg>
                    <div className="txt-upload">Acceuil</div>
                  </button>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/statistique"
                  className={(nav) => (nav.isActive ? "button active" : "button")}
                >
                  <button className="button">
                    <svg>
                      <rect className="border" pathLength="100"></rect> 
                    </svg>
                    <div className="txt-upload">Reseau</div>
                  </button>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/gains"
                  className={(nav) => (nav.isActive ? "button active" : "button")}
                >
                  <button className="button">
                    <svg>
                      <rect className="border" pathLength="100"></rect> 
                    </svg>
                    <div className="txt-upload">Gains</div>
                  </button>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/produits"
                  className={(nav) => (nav.isActive ? "button active" : "button")}
                >
                  <button className="button">
                    <svg>
                      <rect className="border" pathLength="100"></rect> 
                    </svg>
                    <div className="txt-upload">Produits</div>
                  </button>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/outils"
                  className={(nav) => (nav.isActive ? "button active" : "button")}
                >
                  <button className="button">
                    <svg>
                      <rect className="border" pathLength="100"></rect> 
                    </svg>
                    <div className="txt-upload">Outils</div>
                  </button>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/formation"
                  className={(nav) => (nav.isActive ? "button active" : "button")}
                >
                  <button className="button">
                    <svg>
                      <rect className="border" pathLength="100"></rect> 
                    </svg>
                    <div className="txt-upload">Formation</div>
                  </button>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/support"
                  className={(nav) => (nav.isActive ? "button active" : "button")}
                >
                  <button className="button">
                    <svg>
                      <rect className="border" pathLength="100"></rect> 
                    </svg>
                    <div className="txt-upload">Support</div>
                  </button>
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
