import { NavLink } from "react-router-dom"; // Navigation sans rechargement.
import Avatar from "./Avatar"; // Avatar utilisateur.

export default function Navbar() {
  return (
    <div className="drawer mb-3.5">
      {/* Checkbox contrôlant l'ouverture du drawer sur mobile */}
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col  bg-gray-100 border-gray-500">
        {/* Navbar */}
        <div className="navbarw-full">
          <div className="flex-none lg:hidden">
            {/* Bouton hamburger visible uniquement en mobile */}
            <label
              htmlFor="my-drawer-2"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="hidden flex-1 lg:block">
            <ul className="menu menu-horizontal w-full flex-1 flex text-center justify-between bg-gray-100 border-gray-500 px-4 items-center py-2 rounded-2xl">
              <div className="mx-2 px-2 text-2xl font-bold bg-gray-200 p-1.5 rounded-2xl">Invit get $</div>
              <li className="flex-1 ">
                {/* Menu desktop: liste de liens */}
                <ul className="flex gap-4 justify-center mb-2 w-full">
                  <li>
                    <NavLink
                      to="/"
                      className={(nav) =>
                        nav.isActive ? "button active" : "button"
                      }
                    >
                      <button className="button">
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
                      className={(nav) =>
                        nav.isActive ? "button active" : "button"
                      }
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
                      className={(nav) =>
                        nav.isActive ? "button active" : "button"
                      }
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
                      className={(nav) =>
                        nav.isActive ? "button active" : "button"
                      }
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
                      className={(nav) =>
                        nav.isActive ? "button active" : "button"
                      }
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
                      className={(nav) =>
                        nav.isActive ? "button active" : "button"
                      }
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
                      className={(nav) =>
                        nav.isActive ? "button active" : "button"
                      }
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
                {/* Avatar utilisateur */}
                <Avatar />
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="drawer-side">
        {/* Overlay pour fermer le drawer */}
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu gap-4  justify-between bg-base-200 min-h-full w-80 p-4">
          {/* Sidebar content here */}
          <li>
            <ul className="flex flex-col gap-4 cursor-pointer">
              <li>
              <div className="mx-2 px-2 text-2xl font-bold bg-gray-200 p-1.5 justify-center rounded-2xl">Invit get $</div>
              </li>
              {/* Menu mobile: mêmes liens que desktop */}
              <li>
                <NavLink
                  to="/"
                  className={(nav) =>
                    nav.isActive ? "button active" : "button"
                  }
                >
                  <button className="button">
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
                  className={(nav) =>
                    nav.isActive ? "button active" : "button"
                  }
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
                  className={(nav) =>
                    nav.isActive ? "button active" : "button"
                  }
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
                  className={(nav) =>
                    nav.isActive ? "button active" : "button"
                  }
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
                  className={(nav) =>
                    nav.isActive ? "button active" : "button"
                  }
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
                  className={(nav) =>
                    nav.isActive ? "button active" : "button"
                  }
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
                  className={(nav) =>
                    nav.isActive ? "button active" : "button"
                  }
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
            {/* Avatar utilisateur */}
            <Avatar />
          </li>
        </ul>
      </div>
    </div>
  );
}

/*
Résumé pédagogique du composant:
- Navbar utilise un layout "drawer" pour un menu responsive.
- Desktop: menu horizontal + avatar. Mobile: menu latéral activé par checkbox.
- Les NavLink changent de style selon la route active.
*/
