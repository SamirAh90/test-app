import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

import logo from "../../assets/logo1.png";

import "./AppHeader.css";

function AppHeader() {
  const { user, isAuthenticated, logout } = useAuth();

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const userMenuRef = useRef(null);

  /* -------------------------------- */
  /* Close user menu outside          */
  /* -------------------------------- */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  /* -------------------------------- */
  /* Logout                           */
  /* -------------------------------- */

  const handleLogout = () => {
    logout();

    setMenuOpen(false);

    navigate("/");
  };

  /* -------------------------------- */
  /* Navigation class                 */
  /* -------------------------------- */

  const getNavigationClass = ({ isActive }) =>
    `app-header__link ${isActive ? "app-header__link--active" : ""}`;

  return (
    <header className="app-header" dir="ltr" lang="sv">
      <div className="app-header__container">
        {/* -------------------------------- */}
        {/* Brand                            */}
        {/* -------------------------------- */}

        <Link
          className="app-header__brand"
          to="/"
          aria-label="MedborgaTest startsida"
        >
          <img
            className="app-header__logo"
            src={logo}
            alt="MedborgaTest logo"
          />

          <div className="app-header__brand-text">
            <span className="app-header__brand-name">MedborgaTest</span>

            <span className="app-header__brand-subtitle">
              Svenskt medborgarskap
            </span>
          </div>
        </Link>

        {/* -------------------------------- */}
        {/* Navigation                       */}
        {/* -------------------------------- */}

        <nav className="app-header__nav" aria-label="Huvudmeny">
          <NavLink to="/" end className={getNavigationClass}>
            Hem
          </NavLink>

          <NavLink to="/trainer" className={getNavigationClass}>
            Träna
          </NavLink>

          {isAuthenticated && (
            <NavLink to="/min-traning" className={getNavigationClass}>
              Min träning
            </NavLink>
          )}

          {!user?.isPremium && (
            <NavLink to="/premium" className={getNavigationClass}>
              Premium
            </NavLink>
          )}
        </nav>

        {/* -------------------------------- */}
        {/* Account actions                  */}
        {/* -------------------------------- */}

        <div className="app-header__actions">
          {!isAuthenticated ? (
            <>
              <Link className="app-header__login" to="/login">
                Logga in
              </Link>

              <Link className="app-header__register" to="/register">
                Skapa konto
              </Link>
            </>
          ) : (
            <>
              <button
                className="app-header__notification"
                type="button"
                aria-label="Notiser"
              >
                <span aria-hidden="true">🔔</span>

                <span className="app-header__notification-dot" />
              </button>

              <div className="app-header__user" ref={userMenuRef}>
                <button
                  className="app-header__user-button"
                  type="button"
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                  onClick={() => setMenuOpen((currentValue) => !currentValue)}
                >
                  <span className="app-header__avatar">
                    {user?.firstName?.charAt(0).toUpperCase() || "U"}
                  </span>

                  <span className="app-header__user-name">
                    {user?.firstName || "Konto"}
                  </span>

                  <span
                    className={`app-header__chevron ${
                      menuOpen ? "app-header__chevron--open" : ""
                    }`}
                    aria-hidden="true"
                  >
                    ▾
                  </span>
                </button>

                {menuOpen && (
                  <div className="app-header__menu" role="menu">
                    <div className="app-header__menu-user">
                      <strong>
                        {user?.firstName} {user?.lastName}
                      </strong>

                      <span>{user?.email}</span>

                      <small>
                        {user?.isPremium ? "Premiumkonto" : "Gratis konto"}
                      </small>
                    </div>

                    <Link
                      to="/min-traning"
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                    >
                      Min träning
                    </Link>

                    <Link
                      to="/konto"
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                    >
                      Mitt konto
                    </Link>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      Logga ut
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
