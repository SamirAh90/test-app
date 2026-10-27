const API_BASE_URL = "http://localhost:5000/api";

export async function getGlossary() {
  const response = await fetch(`${API_BASE_URL}/glossary`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Kunde inte hämta begreppen.");
  }

  return data;
}
