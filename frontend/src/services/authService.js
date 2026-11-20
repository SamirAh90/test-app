const API_BASE_URL = "http://localhost:5000/api";

export async function requestEmailLink(email) {
  const response = await fetch(`${API_BASE_URL}/auth/email-link`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return parseResponse(response);
}

export async function verifyEmailLink(token) {
  const response = await fetch(`${API_BASE_URL}/auth/email-link/verify`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  return parseResponse(response);
}

export async function loginWithGoogle(credential) {
  const response = await fetch(`${API_BASE_URL}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential }),
  });
  return parseResponse(response);
}

/* -------------------------------- */
/* Parse API response               */
/* -------------------------------- */

async function parseResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Något gick fel.");
  }

  return data;
}

/* -------------------------------- */
/* Register                         */
/* -------------------------------- */

export async function registerUser(userData) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(userData),
  });

  return parseResponse(response);
}

/* -------------------------------- */
/* Login                            */
/* -------------------------------- */

export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(credentials),
  });

  return parseResponse(response);
}

/* -------------------------------- */
/* Current user                     */
/* -------------------------------- */

export async function getCurrentUser(token) {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}

/* -------------------------------- */
/* Update profile                   */
/* -------------------------------- */

export async function updateUserProfile(token, profileData) {
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(profileData),
  });

  return parseResponse(response);
}

/* -------------------------------- */
/* Delete account                   */
/* -------------------------------- */

export async function deleteUserAccount(token, password) {
  const response = await fetch(`${API_BASE_URL}/auth/account`, {
    method: "DELETE",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      password,
    }),
  });

  return parseResponse(response);
}
