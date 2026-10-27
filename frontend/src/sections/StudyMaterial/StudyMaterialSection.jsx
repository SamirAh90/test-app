import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getSubjects } from "../../services/api";

import "./StudyMaterial.css";

function StudyMaterialSection() {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSubjects() {
      try {
        setLoading(true);
        setError("");

        const data = await getSubjects();

        setSubjects(Array.isArray(data) ? data : []);
      } catch (requestError) {
        console.error("Could not load study material subjects:", requestError);

        setError(requestError.message || "Studiematerialet kunde inte hämtas.");
      } finally {
        setLoading(false);
      }
    }

    loadSubjects();
  }, []);

  if (loading) {
    return (
      <main className="study-material-page">
        <div className="study-material-container">
          <section className="study-material-message">
            Hämtar studiematerial...
          </section>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="study-material-page">
        <div className="study-material-container">
          <section className="study-material-message study-material-message--error">
            <h1>Något gick fel</h1>

            <p>{error}</p>

            <button type="button" onClick={() => window.location.reload()}>
              Försök igen
            </button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="study-material-page">
      <div className="study-material-container">
        <header className="study-material-header">
          <span className="study-material-eyebrow">13 ämnen</span>

          <h1>Studiematerial</h1>

          <p>
            Läs om varje ämne i medborgarskapsprovet och fortsätt sedan med
            begrepp och övningsfrågor.
          </p>
        </header>

        {subjects.length > 0 ? (
          <section className="study-material-grid">
            {subjects.map((subject, index) => (
              <button
                className="study-material-card"
                type="button"
                key={subject.id}
                onClick={() =>
                  navigate(`/amnen/${subject.slug}`, {
                    state: {
                      subjectId: subject.id,
                      subjectName: subject.name,
                      subjectSlug: subject.slug,
                    },
                  })
                }
              >
                <span className="study-material-card__number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="study-material-card__content">
                  <strong>{subject.name}</strong>

                  <small>
                    Läs studiematerial, viktiga begrepp och träna på frågor.
                  </small>
                </span>

                <span className="study-material-card__arrow" aria-hidden="true">
                  →
                </span>
              </button>
            ))}
          </section>
        ) : (
          <section className="study-material-message">
            Inga ämnen kunde hittas.
          </section>
        )}
      </div>
    </main>
  );
}

export default StudyMaterialSection;
