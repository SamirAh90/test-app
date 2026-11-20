import './Hero.css';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '../../services/analyticsService';
import useAnalyticsSection from '../../hooks/useAnalyticsSection';
import studyPhoto from '../../assets/hero-campus-students.png';

export default function Hero() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [answer, setAnswer] = useState(null);
  const sectionRef = useAnalyticsSection('landing_hero_seen', { section: 'hero' });
  function open(destination, event, button) {
    trackEvent(event, { button, destination, language: i18n.language });
    navigate(destination);
  }
  return (
    <section ref={sectionRef} className="citizenship-hero" aria-labelledby="landing-title">
      <div className="citizenship-hero__backdrop"><img src={studyPhoto} alt="" width="1679" height="937" fetchPriority="high" /></div>
      <div className="citizenship-hero__layout">
        <div className="citizenship-hero__main">
          <div className="citizenship-hero__message">
            <h1 id="landing-title">{t('hero.banner.headline')}<br /><span>{t('hero.banner.accent')}</span></h1>
            <p>{t('hero.banner.lead')}</p>
            <div className="citizenship-hero__actions">
              <button type="button" className="citizenship-hero__primary" onClick={() => open('/trainer/demo', 'hero_start_training_clicked', 'primary')}>{t('hero.primaryButton')} <span aria-hidden="true">→</span></button>
              <button type="button" className="citizenship-hero__secondary" onClick={() => open('/studiematerial', 'hero_study_material_clicked', 'secondary')}>{t('hero.secondaryButton')}</button>
            </div>
          </div>
          <ul className="citizenship-hero__benefits">{t('hero.banner.benefits', { returnObjects: true }).map(text => <li key={text}><span aria-hidden="true">✓</span>{text}</li>)}</ul>
        </div>
          <aside className="citizenship-hero__quiz" aria-labelledby="hero-question">
          <div className="citizenship-hero__quiz-top"><span>{t('hero.banner.example')}</span><h2>{t('hero.banner.preview')}</h2></div>
          <div className="citizenship-hero__quiz-body">
            <h3 id="hero-question">{t('hero.previewQuestion')}</h3>
            <div className="citizenship-hero__answers" role="group" aria-labelledby="hero-question">
              {['a', 'b', 'c', 'd'].map((key, index) => <button key={key} type="button" aria-pressed={answer === key} className={`${answer === key ? 'is-selected' : ''} ${answer && key === 'b' ? 'is-correct' : ''} ${answer === key && key !== 'b' ? 'is-incorrect' : ''}`} onClick={() => setAnswer(key)}><span className="citizenship-hero__radio" aria-hidden="true"/><span>{String.fromCharCode(65 + index)}. {t(`hero.previewAnswers.${key}`)}</span>{answer && key === 'b' && <span aria-hidden="true">✓</span>}</button>)}
            </div>
            {answer && <p className="citizenship-hero__feedback" role="status">{t(answer === 'b' ? 'hero.banner.correct' : 'hero.banner.incorrect')}</p>}
            <button type="button" className="citizenship-hero__quiz-link" onClick={() => open('/trainer/demo', 'hero_preview_test_clicked', 'preview')}>{t('hero.banner.try')} <span aria-hidden="true">→</span></button>
          </div>
        </aside>
      </div>
    </section>
  );
}
