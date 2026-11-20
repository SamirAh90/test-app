import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import useQuestionTranslation from "../../hooks/useQuestionTranslation";
import logo from "../../assets/logo.png";
import AcademicIcon from "../../components/AcademicIcon";
import { dismissDisclosures } from "./dismissDisclosures";
import { navigationCopy, navigationGroups } from "./navigationContent";
import { navigationLocation } from "./navigationLocation";
import "./Navbar.css";

const languages = [['sv', 'Svenska'], ['en', 'English'], ['ar', 'العربية'], ['fa', 'دری / فارسی']];
const languageFlags = { sv: '🇸🇪', en: '🇬🇧', ar: '🇸🇦', fa: '🇮🇷' };

export default function Navbar() {
  const { i18n } = useTranslation();
  const { isAuthenticated, logout } = useAuth();
  const { translationLanguage, setTranslationLanguage } = useQuestionTranslation();
  const location = useLocation();
  const currentPage = navigationLocation(location.pathname);
  const [mobileOpen, setMobileOpen] = useState(false);
  const root = useRef(null);
  const toggle = useRef(null);
  const language = i18n.language?.split('-')[0] || 'sv';
  const copy = navigationCopy[language] || navigationCopy.sv;
  const rtl = language === 'ar' || language === 'fa';
  const isTrainerPage = /^\/(trainer|min-traning)(\/|$)/.test(location.pathname);

  function closeMenus() {
    dismissDisclosures(root.current);
    setMobileOpen(false);
  }

  function toggleGroup(event) {
    if (!event.currentTarget.open) return;
    root.current?.querySelectorAll('details[open]').forEach(item => {
      if (item !== event.currentTarget) item.open = false;
    });
  }

  useEffect(() => {
    function outside(event) {
      dismissDisclosures(root.current, event.target);
      if (!root.current?.contains(event.target)) {
        setMobileOpen(false);
      }
    }
    function escape(event) {
      if (event.key !== 'Escape' || !root.current?.contains(document.activeElement)) return;
      const detail = document.activeElement.closest('details[open]');
      if (detail) { detail.open = false; detail.querySelector('summary')?.focus(); }
      else { setMobileOpen(false); toggle.current?.focus(); }
    }
    document.addEventListener('pointerdown', outside, true);
    document.addEventListener('focusin', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside, true);
      document.removeEventListener('focusin', outside);
      document.removeEventListener('keydown', escape);
    };
  }, []);

  return (
    <header className="public-nav" ref={root} dir="ltr" lang={language}>
      <div className="public-nav__container">
        <div className="public-nav__top">
          <Link className="public-nav__brand" to="/" onClick={closeMenus}>
            <img src={logo} alt="Medborgarskapsprovet – startsida" width="2160" height="720" />
          </Link>
          <button ref={toggle} className="public-nav__mobile-toggle" type="button" aria-expanded={mobileOpen} aria-controls="public-navigation" onClick={() => {
            if (mobileOpen) closeMenus(); else setMobileOpen(true);
          }}><AcademicIcon name={mobileOpen ? 'close' : 'menu'} /> {mobileOpen ? copy.close : copy.menu}</button>
        </div>
        <div id="public-navigation" className={`public-nav__panel ${mobileOpen ? 'public-nav__panel--open' : ''}`}>
          <nav className="public-nav__links" aria-label={copy.menu}>
            {navigationGroups.map(group => (
              <details className={`public-nav__group ${currentPage?.group === group.key ? 'public-nav__group--current' : ''}`} key={group.key} onToggle={toggleGroup}>
                <summary><span className="public-nav__topic"><span className="public-nav__topic-icon"><AcademicIcon name={({ learn: 'material', practice: 'smart', exam: 'format', citizenship: 'path' })[group.key]} /></span>{copy[group.key]}</span><span aria-hidden="true">▾</span></summary>
                <div className="public-nav__dropdown" dir={rtl ? 'rtl' : 'ltr'}>
                  {group.items.map(([path, key]) => (
                    <Link key={key} to={path} onClick={closeMenus} className={`public-nav__item ${currentPage?.group === group.key && currentPage?.item === key ? 'public-nav__item--current' : ''}`} aria-current={currentPage?.group === group.key && currentPage?.item === key ? 'page' : undefined}>
                      <span className="public-nav__icon"><AcademicIcon name={key} /></span>
                      <span><strong>{copy.items[key][0]}</strong><small>{copy.items[key][1]}</small></span>
                    </Link>
                  ))}
                </div>
              </details>
            ))}
            <a className="public-nav__home" href="https://medborgarskapsprov.se/artiklar/" onClick={closeMenus}>
              <span className="public-nav__topic-icon"><AcademicIcon name="format" /></span>
              {({ sv: 'Nyheter', en: 'News', ar: 'أخبار', fa: 'اخبار' })[language] || 'Nyheter'}
            </a>
          </nav>
          <div className="public-nav__actions">
            {isTrainerPage ? (
              <label className="public-nav__translation">{copy.translation}
                <select value={translationLanguage || 'none'} onChange={event => setTranslationLanguage(event.target.value === 'none' ? null : event.target.value)}>
                  <option value="none">🇸🇪 Svenska</option>
                  {languages.filter(([key]) => key !== 'sv').map(([key, name]) => <option key={key} value={key}>{languageFlags[key]} {name}</option>)}
                </select>
              </label>
            ) : (
              <details className="public-nav__group public-nav__language" onToggle={toggleGroup}>
                <summary><AcademicIcon name="language" /> {copy.language} <span aria-hidden="true">▾</span></summary>
                <div className="public-nav__dropdown public-nav__language-list">
                  {languages.map(([key, name]) => <button key={key} type="button" lang={key} dir="auto" aria-pressed={language === key} onClick={() => { i18n.changeLanguage(key); closeMenus(); }}><span className="public-nav__language-name"><span aria-hidden="true">{languageFlags[key]}</span>{name}</span><span aria-hidden="true">{language === key ? '✓' : ''}</span></button>)}
                </div>
              </details>
            )}
            {isAuthenticated ? (
              <>
                <Link to="/min-traning" className="public-nav__primary" onClick={closeMenus}><AcademicIcon name="account" /> {copy.training}</Link>
                <details className="public-nav__group public-nav__account" onToggle={toggleGroup}>
                  <summary aria-label={copy.account}><AcademicIcon name="account" /><span aria-hidden="true">▾</span></summary>
                  <div className="public-nav__dropdown public-nav__language-list">
                    <Link to="/konto" onClick={closeMenus}>{copy.account}</Link>
                    <button type="button" onClick={() => { logout(); closeMenus(); }}>{copy.logout}</button>
                  </div>
                </details>
              </>
            ) : (
              <><Link to="/login" className="public-nav__login" onClick={closeMenus}>{copy.login}</Link><Link to="/register" className="public-nav__primary" onClick={closeMenus}>{copy.register}</Link></>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
