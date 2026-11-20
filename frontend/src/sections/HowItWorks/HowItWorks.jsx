import './HowItWorks.css';
import { useTranslation } from 'react-i18next';
import useAnalyticsSection from '../../hooks/useAnalyticsSection';
import AcademicIcon from '../../components/AcademicIcon';

export default function HowItWorks() {
  const { t } = useTranslation();
  const sectionRef = useAnalyticsSection('landing_how_it_works_seen', { section: 'how_it_works' });
  const icons = ['language', 'material', 'smart'];
  return (
    <section ref={sectionRef} className="learning-steps" aria-label={t('hero.stepsTitle')}>
      <div className="learning-steps__container">
        {t('hero.steps', { returnObjects: true }).map((step, index) => <article key={step.title} className={`learning-steps__step learning-steps__step--${index + 1}`}>
          <span className="learning-steps__icon"><AcademicIcon name={icons[index]} /></span>
          <div><h2>{step.title}</h2><p>{step.description}</p></div>
          {index < 2 && <span className="learning-steps__arrow" aria-hidden="true">→</span>}
        </article>)}
      </div>
    </section>
  );
}
