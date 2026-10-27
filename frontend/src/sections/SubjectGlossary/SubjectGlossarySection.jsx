import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getStudyMaterial } from "../../services/studyService";

import "./SubjectGlossary.css";

function SubjectGlossarySection() {
  const { subjectSlug } = useParams();
  const navigate = useNavigate();

  const [studyData, setStudyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadGlossary() {
      try {
        setLoading(true);
        setError("");

        const data = await getStudyMaterial(subjectSlug);

        setStudyData(data);
      } catch (requestError) {
        console.error("Could not load subject glossary:", requestError);

        setError(requestError.message || "Begreppen kunde inte hämtas.");
      } finally {
        setLoading(false);
      }
    }

    loadGlossary();
  }, [subjectSlug]);

  if (loading) {
    return (
      <main className="subject-glossary-page">
        <div className="subject-glossary-container">
          <section className="subject-glossary-message">
            Hämtar begrepp...
          </section>
        </div>
      </main>
    );
  }

  if (error || !studyData?.subject) {
    return (
      <main className="subject-glossary-page">
        <div className="subject-glossary-container">
          <section className="subject-glossary-message subject-glossary-message--error">
            <h1>Begreppen kunde inte hittas</h1>

            <p>{error || "Kontrollera länken och försök igen."}</p>

            <button type="button" onClick={() => navigate("/min-traning")}>
              Till Min träning
            </button>
          </section>
        </div>
      </main>
    );
  }

  const { subject, glossary = [] } = studyData;

  return (
    <main className="subject-glossary-page">
      <div className="subject-glossary-container">
        <button
          className="subject-glossary-back"
          type="button"
          onClick={() => navigate(`/amnen/${subject.slug}`)}
        >
          ← Tillbaka till {subject.name}
        </button>

        <header className="subject-glossary-header">
          <span className="subject-glossary-eyebrow">Begrepp</span>

          <h1>Viktiga ord i {subject.name}</h1>

          <p>
            Här hittar du centrala ord och enkla förklaringar som hör till
            ämnet.
          </p>
        </header>

        {glossary.length > 0 ? (
          <section className="subject-glossary-list">
            {glossary.map((item, index) => (
              <article className="subject-glossary-item" key={item.id}>
                <span className="subject-glossary-item__number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <h2>{item.word}</h2>

                  <p>{item.definition}</p>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="subject-glossary-empty">
            <h2>Inga begrepp ännu</h2>

            <p>Begreppen för detta ämne kommer att läggas till senare.</p>
          </section>
        )}

        <section className="subject-glossary-practice">
          <div>
            <span className="subject-glossary-eyebrow">Fortsätt träna</span>

            <h2>Öva frågor om {subject.name}</h2>

            <p>Testa hur väl du förstår ämnet genom att svara på frågor.</p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(`/trainer/subject/${subject.id}`, {
                state: {
                  subjectName: subject.name,
                },
              })
            }
          >
            Öva frågor i ämnet →
          </button>
        </section>
      </div>
    </main>
  );
}

export default SubjectGlossarySection;
