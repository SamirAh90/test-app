import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* -------------------------------- */
/* Subjects                         */
/* -------------------------------- */

export const getSubjects = async () => {
  const response = await api.get("/subjects");

  return response.data;
};

/* -------------------------------- */
/* Questions                        */
/* -------------------------------- */

export const getQuestions = async (language = "sv") => {
  const response = await api.get("/questions", {
    params: {
      language,
    },
  });

  return response.data;
};

export const checkAnswer = async (questionId, answerId, language = "sv") => {
  const response = await api.post(
    `/questions/${questionId}/answer`,
    {
      answerId,
    },
    {
      params: {
        language,
      },
    },
  );

  return response.data;
};

/* -------------------------------- */
/* Payment Settings                 */
/* -------------------------------- */

export const getPaymentSettings = async () => {
  const response = await api.get("/payment-settings");

  return response.data;
};

/* -------------------------------- */
/* Payment Codes                    */
/* -------------------------------- */

export const validateCoupon = async (code) => {
  const response = await api.post("/payment-codes/coupon/validate", {
    code,
  });

  return response.data;
};

export const validatePremiumCode = async (code) => {
  const response = await api.post("/payment-codes/premium/validate", {
    code,
  });

  return response.data;
};

export const redeemPremiumCode = async (code, token) => {
  const response = await api.post(
    "/payment-codes/premium/redeem",
    {
      code,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

/* -------------------------------- */
/* Checkout                         */
/* -------------------------------- */

export const createCheckoutSession = async (token, couponCode = "") => {
  const response = await api.post(
    "/checkout/create-session",
    {
      couponCode,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

/* -------------------------------- */
/* Free Training                    */
/* -------------------------------- */

export const getFreeTrainingStatus = async (token) => {
  const response = await api.get("/free-training/status", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getFreeTrainingSession = async (
  token,
  limit = 15,
  language = "sv",
) => {
  const response = await api.get("/free-training", {
    headers: {
      Authorization: `Bearer ${token}`,
    },

    params: {
      limit,
      language,
    },
  });

  return response.data;
};

/* -------------------------------- */
/* Premium Training                 */
/* -------------------------------- */

export const getPremiumTrainingSession = async (token, limit = 15) => {
  const response = await api.get("/premium-training", {
    params: {
      limit,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

/* -------------------------------- */
/* Smart Training                   */
/* -------------------------------- */

export const getSmartTrainingSession = async (token, limit = 20) => {
  const response = await api.get("/smart-training", {
    params: {
      limit,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export default api;

/* -------------------------------- */
/* Training Sessions                */
/* -------------------------------- */

export const startTrainingSession = async (
  token,
  { quizType, totalQuestions, simulatorQuestionIds = [] },
) => {
  const response = await api.post(
    "/training-sessions/start",
    {
      quizType,
      totalQuestions,
      simulatorQuestionIds,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const saveTrainingAnswer = async (
  token,
  attemptId,
  { questionId, subjectId, selectedAnswerId, correct },
) => {
  const response = await api.post(
    `/training-sessions/${attemptId}/answer`,
    {
      questionId,
      subjectId,
      selectedAnswerId,
      correct,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const saveTrainingFlags = async (
  token,
  attemptId,
  flaggedQuestionIds,
) => {
  const response = await api.put(
    `/training-sessions/${attemptId}/flags`,
    {
      flaggedQuestionIds,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const completeTrainingSession = async (token, attemptId) => {
  const response = await api.post(
    `/training-sessions/${attemptId}/complete`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

/* -------------------------------- */
/* Simulator                        */
/* -------------------------------- */

export const getSimulatorSession = async (token) => {
  const response = await api.get("/simulator", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
