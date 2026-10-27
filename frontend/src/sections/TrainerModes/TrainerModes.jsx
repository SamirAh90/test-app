import { Link } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import usePaymentSettings from "../../hooks/usePaymentSettings";

import { trackEvent } from "../../services/analyticsService";

import "./TrainerModes.css";

function TrainerModes() {
  const { user, isAuthenticated } = useAuth();

  const { formattedPremiumPrice, paymentMethods } = usePaymentSettings();

  /* -------------------------------- */
  /* User access level                */
  /* -------------------------------- */

  const isGuest = !isAuthenticated;

  const isFreeUser = isAuthenticated && !user?.isPremium;

  const isPremiumUser = isAuthenticated && Boolean(user?.isPremium);

  const userType = isGuest ? "guest" : isPremiumUser ? "premium" : "free";

  /* -------------------------------- */
  /* Analytics                        */
  /* -------------------------------- */

  const trackTrainerSelection = (eventName, destination, source) => {
    trackEvent(eventName, {
      destination,
      source,
      userType,
    });
  };

  return (
    <main className="trainer-home">
      {/* -------------------------------- */}
      {/* Introduction                     */}
      {/* -------------------------------- */}

      <section className="trainer-intro">
        <div className="trainer-intro__container">
          <span className="trainer-intro__eyebrow">
            {isPremiumUser
              ? "Full tillgång"
              : isFreeUser
                ? "Gratis konto"
                : "Gratis demo"}
          </span>

          <h1>Förbered dig inför medborgarskapsprovet</h1>

          <p>
            {isPremiumUser
              ? "Välj hur du vill träna och använd hela frågebanken, Smart träning och Provsimulatorn."
              : isFreeUser
                ? "Fortsätt träna med ditt konto, följ din utveckling och använd dina kostnadsfria frågor."
                : "Prova 15 frågor gratis. Inget konto krävs och demot tar ungefär 10 minuter."}
          </p>
        </div>
      </section>

      {/* -------------------------------- */}
      {/* Training modes                   */}
      {/* -------------------------------- */}

      <section className="trainer-modes">
        <div className="trainer-modes__container">
          <div className="trainer-modes__header">
            <h2>Hur vill du träna?</h2>
          </div>

          <div className="trainer-modes__grid">
            {/* -------------------------------- */}
            {/* Gratis demo                      */}
            {/* -------------------------------- */}

            <article className="training-mode training-mode--primary">
              <span className="training-mode__badge">
                {isGuest ? "Börja här" : "Tillgänglig"}
              </span>

              <div className="training-mode__icon">📖</div>

              <h3>Gratis demo</h3>

              <p>
                Träna med 15 frågor, direkt feedback och tydliga förklaringar.
              </p>

              <ul>
                <li>15 frågor</li>
                <li>Cirka 10 minuter</li>
                <li>Resultat direkt efteråt</li>
              </ul>

              <Link
                to="/trainer/demo"
                className="training-mode__button training-mode__button--primary"
                onClick={() =>
                  trackTrainerSelection(
                    "trainer_demo_selected",
                    "/trainer/demo",
                    "demo_card",
                  )
                }
              >
                {isGuest ? "Börja träna →" : "Gör demot →"}
              </Link>
            </article>

            {/* -------------------------------- */}
            {/* Min träning                      */}
            {/* -------------------------------- */}

            <article className="training-mode training-mode--free-account">
              <span className="training-mode__badge">
                {isGuest ? "Gratis konto" : "Ditt konto"}
              </span>

              <div className="training-mode__icon">👤</div>

              <h3>Min träning</h3>

              <p>
                Spara dina resultat, följ din utveckling och fortsätt träna med
                ditt konto.
              </p>

              <ul>
                <li>30 extra kostnadsfria frågor</li>

                <li>Repetera tidigare fel</li>

                <li>Spara dina resultat</li>

                <li>Följ din utveckling</li>
              </ul>

              {isGuest ? (
                <Link
                  to="/register"
                  className="training-mode__button training-mode__button--free"
                  onClick={() =>
                    trackTrainerSelection(
                      "trainer_register_selected",
                      "/register",
                      "my_training_card",
                    )
                  }
                >
                  Skapa gratis konto →
                </Link>
              ) : (
                <Link
                  to="/min-traning"
                  className="training-mode__button training-mode__button--free"
                  onClick={() =>
                    trackTrainerSelection(
                      "trainer_my_training_selected",
                      "/min-traning",
                      "my_training_card",
                    )
                  }
                >
                  Gå till Min träning →
                </Link>
              )}
            </article>

            {/* -------------------------------- */}
            {/* Smart träning                    */}
            {/* -------------------------------- */}

            <article className="training-mode">
              <div className="training-mode__icon">🧠</div>

              <h3>Smart träning</h3>

              <p>Få personliga rekommendationer baserade på dina resultat.</p>

              <ul>
                <li>Personliga rekommendationer</li>

                <li>Träna dina svagaste ämnen</li>

                <li>Effektivare inlärning</li>
              </ul>

              {isPremiumUser ? (
                <>
                  <span className="training-mode__status">
                    Ingår i ditt konto
                  </span>

                  <Link
                    to="/min-traning/smart-training"
                    className="training-mode__button training-mode__button--primary"
                    onClick={() =>
                      trackTrainerSelection(
                        "trainer_smart_training_selected",
                        "/min-traning/smart-training",
                        "smart_training_card",
                      )
                    }
                  >
                    Starta smart träning →
                  </Link>
                </>
              ) : (
                <>
                  <span className="training-mode__status">Ingår i Premium</span>

                  <Link
                    to="/premium"
                    className="training-mode__button training-mode__button--premium"
                    onClick={() =>
                      trackTrainerSelection(
                        "trainer_premium_clicked",
                        "/premium",
                        "smart_training_card",
                      )
                    }
                  >
                    Lås upp Premium →
                  </Link>
                </>
              )}
            </article>

            {/* -------------------------------- */}
            {/* Provsimulator                    */}
            {/* -------------------------------- */}

            <article className="training-mode">
              <div className="training-mode__icon">⏱️</div>

              <h3>Provsimulator</h3>

              <p>
                Genomför ett prov som liknar det riktiga medborgarskapsprovet.
              </p>

              <ul>
                <li>60 frågor på 90 minuter</li>

                <li>Prov i rätt format</li>

                <li>Resultat direkt efteråt</li>
              </ul>

              {isPremiumUser ? (
                <>
                  <span className="training-mode__status">
                    Ingår i ditt konto
                  </span>

                  <Link
                    to="/min-traning/simulator"
                    className="training-mode__button training-mode__button--primary"
                    onClick={() =>
                      trackTrainerSelection(
                        "trainer_simulator_selected",
                        "/min-traning/simulator",
                        "simulator_card",
                      )
                    }
                  >
                    Starta provsimulatorn →
                  </Link>
                </>
              ) : (
                <>
                  <span className="training-mode__status">Ingår i Premium</span>

                  <Link
                    to="/premium"
                    className="training-mode__button training-mode__button--premium"
                    onClick={() =>
                      trackTrainerSelection(
                        "trainer_premium_clicked",
                        "/premium",
                        "simulator_card",
                      )
                    }
                  >
                    Lås upp Premium →
                  </Link>
                </>
              )}
            </article>
          </div>

          {/* -------------------------------- */}
          {/* Common benefits                  */}
          {/* -------------------------------- */}

          <div className="trainer-benefits">
            <span>✓ Direkt feedback</span>
            <span>✓ Tydliga förklaringar</span>
            <span>✓ Träning efter ämne</span>
            <span>✓ Resultat och statistik</span>
          </div>
        </div>
      </section>

      {/* -------------------------------- */}
      {/* Motivation                       */}
      {/* -------------------------------- */}

      <section className="trainer-motivation">
        <div className="trainer-motivation__container">
          <div className="trainer-motivation__content">
            <span className="trainer-motivation__eyebrow">
              {isPremiumUser ? "Träna på ditt sätt" : "Ett enkelt nästa steg"}
            </span>

            <h2>Se vad du redan kan och vad du behöver träna mer på</h2>

            <p>
              Efter varje test får du ett tydligt resultat och rekommendationer
              om vilka områden du bör fokusera på.
            </p>
          </div>

          <div className="trainer-motivation__steps">
            <div>
              <strong>01</strong>
              <span>Välj träningsform</span>
            </div>

            <div>
              <strong>02</strong>
              <span>Svara på frågor</span>
            </div>

            <div>
              <strong>03</strong>
              <span>Få direkt återkoppling</span>
            </div>

            <div>
              <strong>04</strong>
              <span>Se ditt personliga resultat</span>
            </div>

            <div>
              <strong>05</strong>
              <span>Följ din utveckling i Min träning</span>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------- */}
      {/* Premium promotion                */}
      {/* -------------------------------- */}

      {!isPremiumUser && (
        <section className="trainer-premium">
          <div className="trainer-premium__container">
            <div className="trainer-premium__main">
              <div className="trainer-premium__content">
                <span className="trainer-premium__eyebrow">Full tillgång</span>

                <h2>Lås upp hela MedborgaTest</h2>

                <p>
                  Få tillgång till hela frågebanken och alla verktyg du behöver
                  för att förbereda dig inför provet.
                </p>

                <div className="trainer-premium__features">
                  <span>✓ Hela frågebanken</span>

                  <span>✓ Provsimulator</span>

                  <span>✓ Smart träning</span>

                  <span>✓ Repetera fel</span>

                  <span>✓ Statistik och framsteg</span>

                  <span>✓ Framtida uppdateringar</span>
                </div>
              </div>

              <div className="trainer-premium__purchase">
                <div className="trainer-premium__price">
                  <strong>{formattedPremiumPrice}</strong>

                  <span>Engångsbetalning</span>
                </div>

                <Link
                  to="/premium"
                  className="trainer-premium__button"
                  onClick={() =>
                    trackTrainerSelection(
                      "trainer_premium_clicked",
                      "/premium",
                      "premium_banner",
                    )
                  }
                >
                  Lås upp Premium
                </Link>
              </div>
            </div>

            <div className="trainer-premium__guarantee">
              <strong>✓ 14 dagars pengarna tillbaka</strong>

              <span>
                Du kan alltid börja med de 15 kostnadsfria demofrågorna först.
              </span>
            </div>

            <div className="trainer-premium__payments">
              {paymentMethods.card && <span>Kort</span>}

              {paymentMethods.swish && <span>Swish</span>}

              {paymentMethods.klarna && <span>Klarna</span>}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default TrainerModes;
