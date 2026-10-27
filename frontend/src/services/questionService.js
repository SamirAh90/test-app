const API_BASE_URL = "http://localhost:5000/api";

export async function getQuestions(language = "sv") {
  const response = await fetch(
    `${API_BASE_URL}/questions?language=${language}`,
  );

  if (!response.ok) {
    throw new Error("Kunde inte hämta frågor från servern.");
  }

  return response.json();
}

export async function getQuestionsBySubject(subjectId, language = "sv") {
  const response = await fetch(
    `${API_BASE_URL}/questions/subject/${subjectId}?language=${language}`,
  );

  if (!response.ok) {
    throw new Error("Kunde inte hämta frågor för ämnet.");
  }

  return response.json();
}

export async function checkAnswer(questionId, answerId, language = "sv") {
  const response = await fetch(
    `${API_BASE_URL}/questions/${questionId}/answer?language=${language}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answerId,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Kunde inte kontrollera svaret.");
  }

  return response.json();
}
