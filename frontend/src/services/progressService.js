const API_BASE_URL = "http://localhost:5000/api";

async function parseResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Något gick fel.");
  }

  return data;
}

export async function saveQuizAttempt(token, attemptData) {
  const response = await fetch(`${API_BASE_URL}/progress/attempt`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(attemptData),
  });

  return parseResponse(response);
}

export async function getProgressSummary(token) {
  const response = await fetch(`${API_BASE_URL}/progress/summary`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}
