const API_BASE_URL = "http://localhost:5000/api";

export async function getStudyMaterial(subjectIdentifier) {
  const response = await fetch(`${API_BASE_URL}/study/${subjectIdentifier}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Kunde inte hämta studiematerialet.");
  }

  return data;
}
