import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getStudyMaterial } from "../../services/studyService";

import "./SubjectEducation.css";

function SubjectEducationSection() {
  const { subjectSlug } = useParams();
  const navigate = useNavigate();

  const [studyData, setStudyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStudyMaterial() {
      try {
        setLoading(true);
        setError("");

        const data = await getStudyMaterial(subjectSlug);

        setStudyData(data);
      } catch (requestError) {
        console.error("Could not load subject education page:", requestError);

        setError(requestError.message || "Studiematerialet kunde inte hämtas.");
      } finally {
        setLoading(false);
      }
    }

    loadStudyMaterial();
  }, [subjectSlug]);

  if (loading) {
    return (
      <main className="subject-education-page">
        <div className="subject-education-container">
          <section className="subject-education-message">
            Hämtar studiematerial...
          </section>
        </div>
      </main>
    );
  }

  if (error || !studyData?.subject) {
    return (
      <main className="subject-education-page">
        <div className="subject-education-container">
          <section className="subject-education-message subject-education-message--error">
            <h1>Studiematerialet kunde inte hittas</h1>

            <p>{error || "Kontrollera länken och försök igen."}</p>

            <button type="button" onClick={() => navigate("/studiematerial")}>
              Till studiematerial
            </button>
          </section>
        </div>
      </main>
    );
  }

  const { subject, material, glossary = [], sources = [] } = studyData;

  const formattedUpdatedDate = material?.updatedAt
    ? new Date(material.updatedAt).toLocaleDateString("sv-SE")
    : null;

  return (
    <main className="subject-education-page">
      <div className="subject-education-container">
        <button
          className="subject-education-back"
          type="button"
          onClick={() => navigate("/studiematerial")}
        >
          ← Tillbaka till studiematerial
        </button>

        <article className="subject-education-article">
          <header className="subject-education-header">
            <span className="subject-education-eyebrow">Studiematerial</span>

            <h1>{material?.title || subject.name}</h1>

            <p>
              {material?.introduction ||
                subject.description ||
                "Studiematerialet för ämnet är inte färdigt ännu."}
            </p>
          </header>

          <section className="subject-education-content">
            {material?.body ? (
              <div
                className="subject-education-body"
                dangerouslySetInnerHTML={{
                  __html: material.body,
                }}
              />
            ) : (
              <p>
                Studiematerialet för {subject.name} kommer att läggas in här.
              </p>
            )}
          </section>

          <section className="subject-education-concepts">
            <div>
              <span className="subject-education-eyebrow">Begrepp</span>

              <h2>Viktiga ord och begrepp</h2>

              <p>
                {glossary.length > 0
                  ? `${glossary.length} viktiga begrepp finns för detta ämne.`
                  : "Begreppen för detta ämne läggs till senare."}
              </p>
            </div>

            <button
              className="subject-education-link-button"
              type="button"
              disabled={glossary.length === 0}
              onClick={() =>
                navigate(`/amnen/${subject.slug}/begrepp`, {
                  state: {
                    subjectId: subject.id,
                    subjectName: subject.name,
                    glossary,
                  },
                })
              }
            >
              Visa begrepp →
            </button>
          </section>

          {sources.length > 0 && (
            <section className="subject-education-sources">
              <h2>Officiella källor</h2>

              <ul>
                {sources.map((source) => (
                  <li key={source.id}>
                    <a href={source.url} target="_blank" rel="noreferrer">
                      {source.title} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {formattedUpdatedDate && (
            <p className="subject-education-updated">
              Senast uppdaterad: {formattedUpdatedDate}
            </p>
          )}

          <p className="subject-education-disclaimer">
            MedborgaTest är en fristående studietjänst och är inte en myndighet.
            Innehållet bygger på det offentliga materialet Sverige i fokus och
            är inte de officiella provfrågorna. Vi garanterar inte godkänt
            resultat.
          </p>
        </article>

        <section className="subject-education-practice">
          <div>
            <span className="subject-education-eyebrow">
              Testa dina kunskaper
            </span>

            <h2>Öva frågor om {subject.name}</h2>

            <p>
              Träna på frågor som hör till detta ämne och se direkt vilka delar
              du behöver repetera.
            </p>
          </div>

          <button
            className="subject-education-primary"
            type="button"
            onClick={() =>
              navigate(`/trainer/subject/${subject.id}`, {
                state: {
                  subjectName: subject.name,
                  returnTo: `/amnen/${subject.slug}`,
                  returnLabel: "Till studiematerialet",
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

export default SubjectEducationSection;
