import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { navigationCopy } from '../../sections/Navbar/navigationContent';
import { navigationLocation } from '../../sections/Navbar/navigationLocation';
import './PublicBreadcrumbs.css';

export default function PublicBreadcrumbs() {
  const location = useLocation();
  const { i18n } = useTranslation();
  if (location.pathname === '/') return null;
  const language = i18n.language?.split('-')[0] || 'sv';
  const copy = navigationCopy[language] || navigationCopy.sv;
  const current = navigationLocation(location.pathname);
  const accountPages = {
    '/login': copy.login, '/register': copy.register, '/konto': copy.account,
    '/min-traning': copy.training, '/premium': 'Premium',
  };
  const title = current ? copy.items[current.item][0] : accountPages[location.pathname];
  if (!title) return null;
  const subjectName = location.state?.subjectName;
  const parent = current?.group === 'citizenship' && location.pathname !== '/medborgarskap'
    ? { href: '/medborgarskap', title: copy.citizenship }
    : current?.subject ? { href: '/studiematerial', title: copy.items.material[0] } : null;
  return (
    <div className="public-breadcrumbs" lang={language} dir={language === 'ar' || language === 'fa' ? 'rtl' : 'ltr'}>
      <nav aria-label={language === 'sv' ? 'Brödsmulor' : 'Breadcrumb'}>
        <ol>
          <li><Link to="/">{copy.home}</Link></li>
          {parent && <li><Link to={parent.href}>{parent.title}</Link></li>}
          <li><span aria-current="page">{current?.subject && subjectName ? subjectName : title}</span></li>
        </ol>
      </nav>
    </div>
  );
}
