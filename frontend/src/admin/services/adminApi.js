const API_BASE_URL = "http://localhost:5000/api/admin";

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Ett oväntat fel inträffade.");
  }

  return data;
}

/* -------------------------------- */
/* Authentication                   */
/* -------------------------------- */

export async function adminLogin(credentials) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  return parseResponse(response);
}

export async function getCurrentAdmin(token) {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}

/* -------------------------------- */
/* Dashboard                        */
/* -------------------------------- */

export async function getAdminDashboard(token) {
  const response = await fetch(`${API_BASE_URL}/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}

/* -------------------------------- */
/* Subjects                         */
/* -------------------------------- */

export async function getAdminSubjects(token) {
  const response = await fetch(`${API_BASE_URL}/subjects`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}

export async function getAdminSubject(token, subjectId) {
  const response = await fetch(`${API_BASE_URL}/subjects/${subjectId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}

export async function createAdminSubject(token, subject) {
  const response = await fetch(`${API_BASE_URL}/subjects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(subject),
  });

  return parseResponse(response);
}

export async function updateAdminSubject(token, subjectId, subject) {
  const response = await fetch(`${API_BASE_URL}/subjects/${subjectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(subject),
  });

  return parseResponse(response);
}

export async function deleteAdminSubject(token, subjectId) {
  const response = await fetch(`${API_BASE_URL}/subjects/${subjectId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}

/* -------------------------------- */
/* Study Material                   */
/* -------------------------------- */

export async function getAdminMaterials(token) {
  const response = await fetch(`${API_BASE_URL}/materials`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}

export async function getAdminMaterial(token, subjectId) {
  const response = await fetch(`${API_BASE_URL}/materials/${subjectId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}

export async function saveAdminMaterial(token, subjectId, material) {
  const response = await fetch(`${API_BASE_URL}/materials/${subjectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(material),
  });

  return parseResponse(response);
}

/* -------------------------------- */
/* Glossary                         */
/* -------------------------------- */

export async function getAdminGlossary(token, subjectId = "") {
  const query = subjectId ? `?subjectId=${subjectId}` : "";

  const response = await fetch(`${API_BASE_URL}/glossary${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}

export async function getAdminGlossaryTerm(token, termId) {
  const response = await fetch(`${API_BASE_URL}/glossary/${termId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}

export async function createAdminGlossaryTerm(token, term) {
  const response = await fetch(`${API_BASE_URL}/glossary`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(term),
  });

  return parseResponse(response);
}

export async function updateAdminGlossaryTerm(token, termId, term) {
  const response = await fetch(`${API_BASE_URL}/glossary/${termId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(term),
  });

  return parseResponse(response);
}

export async function deleteAdminGlossaryTerm(token, termId) {
  const response = await fetch(`${API_BASE_URL}/glossary/${termId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}

export async function deleteAdminMaterial(token, subjectId) {
  const response = await fetch(`${API_BASE_URL}/materials/${subjectId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}

/* -------------------------------- */
/* Questions                        */
/* -------------------------------- */

export async function getAdminQuestions(token) {
  const response = await fetch(`${API_BASE_URL}/questions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}

export async function getAdminQuestion(token, questionId) {
  const response = await fetch(`${API_BASE_URL}/questions/${questionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}

export async function updateAdminQuestion(token, questionId, questionData) {
  const response = await fetch(`${API_BASE_URL}/questions/${questionId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(questionData),
  });

  return parseResponse(response);
}

export async function createAdminQuestion(token, questionData) {
  const response = await fetch(`${API_BASE_URL}/questions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(questionData),
  });

  return parseResponse(response);
}

export async function deleteAdminQuestion(token, questionId) {
  const response = await fetch(`${API_BASE_URL}/questions/${questionId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}
/* -------------------------------- */
/* Sources                          */
/* -------------------------------- */

export async function getAdminSources(token, subjectId = "") {
  const query = subjectId ? `?subjectId=${subjectId}` : "";

  const response = await fetch(`${API_BASE_URL}/sources${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}

export async function getAdminSource(token, sourceId) {
  const response = await fetch(`${API_BASE_URL}/sources/${sourceId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}

export async function createAdminSource(token, sourceData) {
  const response = await fetch(`${API_BASE_URL}/sources`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(sourceData),
  });

  return parseResponse(response);
}

export async function updateAdminSource(token, sourceId, sourceData) {
  const response = await fetch(`${API_BASE_URL}/sources/${sourceId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(sourceData),
  });

  return parseResponse(response);
}

export async function deleteAdminSource(token, sourceId) {
  const response = await fetch(`${API_BASE_URL}/sources/${sourceId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}

/* -------------------------------- */
/* Translations                     */
/* -------------------------------- */

export async function getAdminTranslationQuestions(token) {
  const response = await fetch(`${API_BASE_URL}/translations/questions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}

export async function getAdminQuestionTranslations(token, questionId) {
  const response = await fetch(
    `${API_BASE_URL}/translations/questions/${questionId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return parseResponse(response);
}

export async function saveAdminQuestionTranslations(
  token,
  questionId,
  translations,
) {
  const response = await fetch(
    `${API_BASE_URL}/translations/questions/${questionId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        translations,
      }),
    },
  );

  return parseResponse(response);
}
/* -------------------------------- */
/* Users                            */
/* -------------------------------- */

export async function getAdminUsers(token) {
  const response = await fetch(`${API_BASE_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}

export async function createAdminUser(token, userData) {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  return parseResponse(response);
}

export async function getAdminUser(token, userId) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}

export async function updateAdminUser(token, userId, userData) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  return parseResponse(response);
}

export async function deactivateAdminUser(token, userId) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/deactivate`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}

export async function activateAdminUser(token, userId) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/activate`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}

export async function deleteAdminUser(token, userId) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}

/* -------------------------------- */
/* Analytics                        */
/* -------------------------------- */

export async function getAdminAnalytics(token) {
  const response = await fetch(`${API_BASE_URL}/analytics`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}

/* -------------------------------- */
/* Settings                         */
/* -------------------------------- */

export async function getAdminSettings(token) {
  const response = await fetch(`${API_BASE_URL}/settings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}

export async function updateUserCleanupSettings(token, settingsData) {
  const response = await fetch(`${API_BASE_URL}/settings/user-cleanup`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(settingsData),
  });

  return parseResponse(response);
}

export async function previewUserCleanup(token) {
  const response = await fetch(
    `${API_BASE_URL}/settings/user-cleanup/preview`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return parseResponse(response);
}

export async function runUserCleanup(token) {
  const response = await fetch(`${API_BASE_URL}/settings/user-cleanup/run`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}

/* -------------------------------- */
/* Payments                         */
/* -------------------------------- */

export async function getAdminPaymentStats(token) {
  const response = await fetch(`${API_BASE_URL}/payments/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}

export async function getAdminPaymentTransactions(token, filters = {}) {
  const params = new URLSearchParams();

  if (filters.status && filters.status !== "all") {
    params.append("status", filters.status);
  }

  if (filters.paymentMethod && filters.paymentMethod !== "all") {
    params.append("paymentMethod", filters.paymentMethod);
  }

  if (filters.search) {
    params.append("search", filters.search);
  }

  if (filters.startDate) {
    params.append("startDate", filters.startDate);
  }

  if (filters.endDate) {
    params.append("endDate", filters.endDate);
  }

  if (filters.page) {
    params.append("page", filters.page);
  }

  if (filters.limit) {
    params.append("limit", filters.limit);
  }

  const queryString = params.toString();

  const url = queryString
    ? `${API_BASE_URL}/payments?${queryString}`
    : `${API_BASE_URL}/payments`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}

export async function getAdminPaymentTransaction(token, transactionId) {
  const response = await fetch(`${API_BASE_URL}/payments/${transactionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}
/* -------------------------------- */
/* Payment Settings                 */
/* -------------------------------- */

export async function getAdminPaymentSettings(token) {
  const response = await fetch(`${API_BASE_URL}/payment-settings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}

export async function updateAdminPaymentSettings(token, settingsData) {
  const response = await fetch(`${API_BASE_URL}/payment-settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(settingsData),
  });

  return parseResponse(response);
}
/* -------------------------------- */
/* Coupons                          */
/* -------------------------------- */

export async function getAdminCoupons(token) {
  const response = await fetch(`${API_BASE_URL}/coupons`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}

export async function getAdminCoupon(token, couponId) {
  const response = await fetch(`${API_BASE_URL}/coupons/${couponId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}

export async function createAdminCoupon(token, couponData) {
  const response = await fetch(`${API_BASE_URL}/coupons`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(couponData),
  });

  return parseResponse(response);
}

export async function updateAdminCoupon(token, couponId, couponData) {
  const response = await fetch(`${API_BASE_URL}/coupons/${couponId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(couponData),
  });

  return parseResponse(response);
}

export async function deleteAdminCoupon(token, couponId) {
  const response = await fetch(`${API_BASE_URL}/coupons/${couponId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}

/* -------------------------------- */
/* Premium Codes                    */
/* -------------------------------- */

export async function getAdminPremiumCodes(token) {
  const response = await fetch(`${API_BASE_URL}/premium-codes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}

export async function getAdminPremiumCode(token, premiumCodeId) {
  const response = await fetch(
    `${API_BASE_URL}/premium-codes/${premiumCodeId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return parseResponse(response);
}

export async function createAdminPremiumCode(token, premiumCodeData) {
  const response = await fetch(`${API_BASE_URL}/premium-codes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(premiumCodeData),
  });

  return parseResponse(response);
}

export async function updateAdminPremiumCode(
  token,
  premiumCodeId,
  premiumCodeData,
) {
  const response = await fetch(
    `${API_BASE_URL}/premium-codes/${premiumCodeId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(premiumCodeData),
    },
  );

  return parseResponse(response);
}

export async function deleteAdminPremiumCode(token, premiumCodeId) {
  const response = await fetch(
    `${API_BASE_URL}/premium-codes/${premiumCodeId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return parseResponse(response);
}
