import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getGlossary } from "../../services/glossaryService";

import "./Glossary.css";

function GlossarySection() {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadGlossary() {
      try {
        setLoading(true);
        setError("");

        const data = await getGlossary();

        setSubjects(Array.isArray(data) ? data : []);
      } catch (requestError) {
        console.error("Could not load glossary:", requestError);

        setError(requestError.message || "Begreppen kunde inte hämtas.");
      } finally {
        setLoading(false);
      }
    }

    loadGlossary();
  }, []);

  const filteredSubjects = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLocaleLowerCase("sv-SE");

    return subjects
      .map((subject) => {
        const words = Array.isArray(subject.words) ? subject.words : [];

        if (!normalizedSearchTerm) {
          return {
            ...subject,
            words,
          };
        }

        const subjectMatches = subject.name
          .toLocaleLowerCase("sv-SE")
          .includes(normalizedSearchTerm);

        const filteredWords = words.filter((item) => {
          const word = item.word.toLocaleLowerCase("sv-SE");

          const definition = item.definition.toLocaleLowerCase("sv-SE");

          return (
            word.includes(normalizedSearchTerm) ||
            definition.includes(normalizedSearchTerm)
          );
        });

        return {
          ...subject,
          words: subjectMatches ? words : filteredWords,
        };
      })
      .filter((subject) => subject.words.length > 0);
  }, [searchTerm, subjects]);

  if (loading) {
    return (
      <main className="glossary-page">
        <div className="glossary-container">
          <section className="glossary-message">Hämtar begrepp...</section>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="glossary-page">
        <div className="glossary-container">
          <section className="glossary-message glossary-message--error">
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
    <main className="glossary-page">
      <div className="glossary-container">
        <header className="glossary-header">
          <span className="glossary-eyebrow">Begrepp</span>

          <h1>Viktiga ord inför provet</h1>

          <p>
            Här hittar du centrala ord och enkla förklaringar från alla ämnen i
            medborgarskapsprovet.
          </p>

          <label className="glossary-search">
            <span className="glossary-search__icon">🔎</span>

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Sök efter ett ord eller en förklaring"
              aria-label="Sök bland begrepp"
            />
          </label>
        </header>

        {filteredSubjects.length > 0 ? (
          <div className="glossary-subject-list">
            {filteredSubjects.map((subject) => (
              <section className="glossary-subject" key={subject.id}>
                <button
                  className="glossary-subject__title"
                  type="button"
                  onClick={() => navigate(`/amnen/${subject.slug}`)}
                >
                  <span>{subject.name}</span>

                  <span aria-hidden="true">→</span>
                </button>

                <div className="glossary-word-list">
                  {subject.words.map((item) => (
                    <article className="glossary-word" key={item.id}>
                      <h2>{item.word}</h2>

                      <p>{item.definition}</p>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <section className="glossary-empty">
            <h2>Inga begrepp hittades</h2>

            <p>Prova att söka efter ett annat ord eller rensa sökfältet.</p>

            {searchTerm && (
              <button type="button" onClick={() => setSearchTerm("")}>
                Rensa sökning
              </button>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

export default GlossarySection;
