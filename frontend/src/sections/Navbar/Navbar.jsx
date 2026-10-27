import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuth } from "../../contexts/AuthContext";
import useQuestionTranslation from "../../hooks/useQuestionTranslation";

import logo from "../../assets/logo.png";

import "./Navbar.css";

function Navbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const { user, isAuthenticated, logout } = useAuth();

  const { translationLanguage, setTranslationLanguage } =
    useQuestionTranslation();

  const [menuOpen, setMenuOpen] = useState(false);

  const menuButtonRef = useRef(null);
  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);

  /* -------------------------------- */
  /* Detect quiz / training pages     */
  /* -------------------------------- */

  const isTrainerPage =
    location.pathname === "/trainer" ||
    location.pathname.startsWith("/trainer/") ||
    location.pathname === "/min-traning" ||
    location.pathname.startsWith("/min-traning/");

  /* -------------------------------- */
  /* Website language                 */
  /* -------------------------------- */

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  /* -------------------------------- */
  /* Question translation             */
  /* -------------------------------- */

  const changeQuestionTranslation = (event) => {
    const language = event.target.value;

    if (language === "none") {
      setTranslationLanguage(null);
      return;
    }

    setTranslationLanguage(language);
  };

  /* -------------------------------- */
  /* Close menu                       */
  /* -------------------------------- */

  const closeMenu = () => {
    setMenuOpen(false);
  };

  /* -------------------------------- */
  /* Logout                           */
  /* -------------------------------- */

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  /* -------------------------------- */
  /* Mobile drawer behavior           */
  /* -------------------------------- */

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);

        window.requestAnimationFrame(() => {
          menuButtonRef.current?.focus();
        });

        return;
      }

      if (event.key !== "Tab" || !drawerRef.current) {
        return;
      }

      const focusableElements = drawerRef.current.querySelectorAll(
        'a[href], button:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      if (!focusableElements.length) {
        return;
      }

      const firstElement = focusableElements[0];

      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;

      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  /* -------------------------------- */
  /* Close drawer after desktop resize*/
  /* -------------------------------- */

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1000) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <header className="navbar">
        {/* -------------------------------- */}
        {/* Logo                             */}
        {/* -------------------------------- */}

        <Link
          className="navbar__logo"
          to="/"
          aria-label="MedborgaTest startsida"
        >
          <img src={logo} alt="MedborgaTest logo" />

          <div className="navbar__brand">
            <span className="navbar__brand-name">MedborgaTest</span>

            <span className="navbar__brand-subtitle">
              {t("navbar.brandSubtitle")}
            </span>
          </div>
        </Link>

        {/* -------------------------------- */}
        {/* Desktop navigation               */}
        {/* -------------------------------- */}

        <nav className="navbar__links" aria-label="Huvudmeny">
          <Link to="/">{t("navbar.home")}</Link>

          <Link to="/studiematerial">{t("navbar.subjects")}</Link>

          <Link to="/begrepp">{t("navbar.glossary")}</Link>

          <Link to="/trainer">{t("navbar.trainer")}</Link>

          <Link to="/om-provet">{t("navbar.about")}</Link>
        </nav>

        {/* -------------------------------- */}
        {/* Actions                          */}
        {/* -------------------------------- */}

        <div className="navbar__actions">
          {/* -------------------------------- */}
          {/* Quiz translation selector        */}
          {/* -------------------------------- */}

          {isTrainerPage ? (
            <select
              className="navbar__language navbar__language--translation"
              value={translationLanguage || "none"}
              onChange={changeQuestionTranslation}
              aria-label="Välj språk för översättning"
            >
              <option value="none">Översättning</option>

              <option value="en">English</option>

              <option value="ar">العربية</option>

              <option value="fa">دری / فارسی</option>
            </select>
          ) : (
            /* -------------------------------- */
            /* Normal website language           */
            /* -------------------------------- */

            <select
              className="navbar__language"
              value={i18n.language}
              onChange={(event) => changeLanguage(event.target.value)}
              aria-label={t("navbar.languageLabel")}
            >
              <option value="sv">Svenska</option>

              <option value="en">English</option>

              <option value="ar">العربية</option>

              <option value="fa">دری / فارسی</option>
            </select>
          )}

          {/* -------------------------------- */}
          {/* Desktop account                  */}
          {/* -------------------------------- */}

          <div className="navbar__desktop-account">
            {!isAuthenticated ? (
              <Link className="navbar__login-button" to="/login">
                {t("navbar.login")}
              </Link>
            ) : (
              <Link
                className="navbar__profile-button"
                to="/min-traning"
                aria-label="Gå till Min träning"
              >
                <span className="navbar__profile-avatar">
                  {user?.firstName?.charAt(0).toUpperCase() || "U"}
                </span>

                <span className="navbar__profile-name">
                  {user?.firstName || "Konto"}
                </span>

                <span className="navbar__account-arrow">→</span>
              </Link>
            )}
          </div>

          {/* -------------------------------- */}
          {/* Tablet / mobile menu             */}
          {/* -------------------------------- */}

          <div className="navbar__mobile-menu">
            <button
              ref={menuButtonRef}
              type="button"
              className={`navbar__menu-button ${
                menuOpen ? "navbar__menu-button--active" : ""
              }`}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen(true)}
            >
              <span className="navbar__menu-icon" aria-hidden="true">
                ☰
              </span>

              <span>Meny</span>
            </button>
          </div>
        </div>
      </header>

      {/* -------------------------------- */}
      {/* Mobile drawer                    */}
      {/* -------------------------------- */}

      <div
        className={`navbar__drawer-layer ${
          menuOpen ? "navbar__drawer-layer--open" : ""
        }`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className="navbar__drawer-backdrop"
          aria-label="Stäng meny"
          tabIndex={menuOpen ? 0 : -1}
          onClick={closeMenu}
        />

        <aside
          id="mobile-navigation"
          ref={drawerRef}
          className="navbar__drawer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="navbar-drawer-title"
        >
          {/* -------------------------------- */}
          {/* Drawer header                    */}
          {/* -------------------------------- */}

          <div className="navbar__drawer-header">
            <div>
              <span className="navbar__drawer-eyebrow">MedborgaTest</span>

              <h2 id="navbar-drawer-title">Meny</h2>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              className="navbar__drawer-close"
              aria-label="Stäng meny"
              onClick={() => {
                closeMenu();

                window.requestAnimationFrame(() => {
                  menuButtonRef.current?.focus();
                });
              }}
            >
              ×
            </button>
          </div>

          {/* -------------------------------- */}
          {/* Navigation                       */}
          {/* -------------------------------- */}

          <nav
            className="navbar__drawer-navigation"
            aria-label="Mobil huvudmeny"
          >
            <Link to="/" onClick={closeMenu}>
              <span className="navbar__drawer-link-icon">⌂</span>

              <span className="navbar__drawer-link-text">
                <strong>{t("navbar.home")}</strong>

                <small>Startsidan</small>
              </span>

              <span className="navbar__drawer-arrow">→</span>
            </Link>

            <Link to="/studiematerial" onClick={closeMenu}>
              <span className="navbar__drawer-link-icon">📘</span>

              <span className="navbar__drawer-link-text">
                <strong>{t("navbar.subjects")}</strong>

                <small>Läs och lär dig först</small>
              </span>

              <span className="navbar__drawer-arrow">→</span>
            </Link>

            <Link to="/trainer" onClick={closeMenu}>
              <span className="navbar__drawer-link-icon">🎯</span>

              <span className="navbar__drawer-link-text">
                <strong>{t("navbar.trainer")}</strong>

                <small>Öva med frågor</small>
              </span>

              <span className="navbar__drawer-arrow">→</span>
            </Link>

            <Link to="/begrepp" onClick={closeMenu}>
              <span className="navbar__drawer-link-icon">📖</span>

              <span className="navbar__drawer-link-text">
                <strong>{t("navbar.glossary")}</strong>

                <small>Förstå viktiga ord och begrepp</small>
              </span>

              <span className="navbar__drawer-arrow">→</span>
            </Link>

            <Link to="/om-provet" onClick={closeMenu}>
              <span className="navbar__drawer-link-icon">ⓘ</span>

              <span className="navbar__drawer-link-text">
                <strong>{t("navbar.about")}</strong>

                <small>Läs om medborgarskapsprovet</small>
              </span>

              <span className="navbar__drawer-arrow">→</span>
            </Link>
          </nav>

          {/* -------------------------------- */}
          {/* Account                          */}
          {/* -------------------------------- */}

          <div className="navbar__drawer-account">
            {isAuthenticated ? (
              <>
                <div className="navbar__drawer-user">
                  <span className="navbar__drawer-avatar">
                    {user?.firstName?.charAt(0).toUpperCase() || "U"}
                  </span>

                  <div>
                    <strong>
                      {user?.firstName} {user?.lastName}
                    </strong>

                    <span>{user?.email}</span>

                    <small>
                      {user?.isPremium ? "Premiumkonto" : "Gratis konto"}
                    </small>
                  </div>
                </div>

                <div className="navbar__drawer-account-links">
                  <Link to="/min-traning" onClick={closeMenu}>
                    <span>🧠</span>

                    <strong>Min träning</strong>

                    <span className="navbar__drawer-arrow">→</span>
                  </Link>

                  <Link to="/konto" onClick={closeMenu}>
                    <span>👤</span>

                    <strong>Mitt konto</strong>

                    <span className="navbar__drawer-arrow">→</span>
                  </Link>

                  <button type="button" onClick={handleLogout}>
                    <span>↪</span>

                    <strong>Logga ut</strong>
                  </button>
                </div>
              </>
            ) : (
              <div className="navbar__drawer-logged-out">
                <p>
                  Logga in för att spara dina resultat och följa din utveckling.
                </p>

                <Link
                  className="navbar__drawer-login"
                  to="/login"
                  onClick={closeMenu}
                >
                  Logga in
                </Link>
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}

export default Navbar;
