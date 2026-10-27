import { Link } from "react-router-dom";

import "./AboutTest.css";

function AboutTestSection() {
  return (
    <main className="about-test-page">
      <div className="about-test-container">
        <header className="about-test-hero">
          <span className="about-test-eyebrow">Om provet</span>

          <h1>Det svenska medborgarskapsprovet</h1>

          <p>
            Här hittar du en enkel översikt över vad provet handlar om, hur du
            kan förbereda dig och hur MedborgaTest kan hjälpa dig i din träning.
          </p>
        </header>

        <section className="about-test-content">
          <article className="about-test-card">
            <span className="about-test-card__number">01</span>

            <h2>Vad handlar provet om?</h2>

            <p>
              Provet handlar om kunskaper om det svenska samhället. Innehållet
              är indelat i 13 ämnen, till exempel demokrati, lag och rätt,
              arbetsmarknad, välfärd, historia och traditioner.
            </p>
          </article>

          <article className="about-test-card">
            <span className="about-test-card__number">02</span>

            <h2>Hur kan du förbereda dig?</h2>

            <p>
              Börja med att läsa studiematerialet för varje ämne. Gå därefter
              igenom viktiga begrepp och träna på frågor för att kontrollera vad
              du redan kan och vad du behöver repetera.
            </p>
          </article>

          <article className="about-test-card">
            <span className="about-test-card__number">03</span>

            <h2>Så hjälper MedborgaTest dig</h2>

            <p>
              MedborgaTest samlar studiematerial, begrepp, övningsfrågor,
              förklaringar och statistik på ett ställe. Du kan träna steg för
              steg och följa din utveckling över tid.
            </p>
          </article>
        </section>

        <section className="about-test-path">
          <div>
            <span className="about-test-eyebrow">Rekommenderad studieväg</span>

            <h2>Läs, förstå och träna</h2>

            <p>
              En tydlig ordning gör det enklare att komma ihåg innehållet och
              upptäcka vilka ämnen du behöver arbeta mer med.
            </p>
          </div>

          <div className="about-test-steps">
            <div>
              <strong>1</strong>
              <span>Läs studiematerialet</span>
            </div>

            <div>
              <strong>2</strong>
              <span>Lär dig viktiga begrepp</span>
            </div>

            <div>
              <strong>3</strong>
              <span>Öva på frågor</span>
            </div>

            <div>
              <strong>4</strong>
              <span>Följ dina resultat</span>
            </div>
          </div>
        </section>

        <section className="about-test-notice">
          <h2>Viktig information</h2>

          <p>
            MedborgaTest är en fristående studietjänst och är inte en myndighet.
            Våra frågor är övningsfrågor och inte de officiella provfrågorna. Vi
            garanterar inte ett godkänt resultat.
          </p>

          <p>
            Kontrollera alltid den senaste informationen hos UHR och
            Migrationsverket.
          </p>
        </section>

        <section className="about-test-actions">
          <div>
            <span className="about-test-eyebrow">Börja förbereda dig</span>

            <h2>Välj hur du vill fortsätta</h2>
          </div>

          <div className="about-test-actions__links">
            <Link
              className="about-test-button about-test-button--secondary"
              to="/studiematerial"
            >
              Läs studiematerial
            </Link>

            <Link
              className="about-test-button about-test-button--secondary"
              to="/begrepp"
            >
              Utforska begrepp
            </Link>

            <Link
              className="about-test-button about-test-button--primary"
              to="/trainer"
            >
              Börja träna →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AboutTestSection;
