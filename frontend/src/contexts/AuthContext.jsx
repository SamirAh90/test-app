import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  deleteUserAccount,
  getCurrentUser,
  loginUser,
  loginWithGoogle,
  verifyEmailLink,
  registerUser,
  updateUserProfile,
} from "../services/authService";

const AuthContext = createContext(null);

const TOKEN_STORAGE_KEY = "medborgatest_token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem(TOKEN_STORAGE_KEY),
  );

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  /* -------------------------------- */
  /* Restore session                  */
  /* -------------------------------- */

  useEffect(() => {
    async function restoreSession() {
      if (!token) {
        setUser(null);
        setLoading(false);

        return;
      }

      try {
        const response = await getCurrentUser(token);

        setUser(response.user);
      } catch (error) {
        console.error("Failed to restore session:", error);

        localStorage.removeItem(TOKEN_STORAGE_KEY);

        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, [token]);

  /* -------------------------------- */
  /* Save login/register session      */
  /* -------------------------------- */

  const saveSession = (response) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, response.token);

    setToken(response.token);

    setUser(response.user);
  };

  /* -------------------------------- */
  /* Register                         */
  /* -------------------------------- */

  const register = async (userData) => {
    const response = await registerUser(userData);

    saveSession(response);

    return response;
  };

  /* -------------------------------- */
  /* Login                            */
  /* -------------------------------- */

  const emailLinkLogin = async (token) => {
    const response = await verifyEmailLink(token);
    saveSession(response);
    return response;
  };

  const googleLogin = async (credential) => {
    const response = await loginWithGoogle(credential);
    saveSession(response);
    return response;
  };

  const login = async (credentials) => {
    const response = await loginUser(credentials);

    saveSession(response);

    return response;
  };

  /* -------------------------------- */
  /* Update profile                   */
  /* -------------------------------- */

  const updateProfile = async (profileData) => {
    if (!token) {
      throw new Error("Du måste vara inloggad.");
    }

    const response = await updateUserProfile(token, profileData);

    /*
      Update user globally so the new
      name/email appears immediately in
      AppHeader, Min träning, Konto etc.
    */

    setUser(response.user);

    return response;
  };

  /* -------------------------------- */
  /* Refresh current user             */
  /* -------------------------------- */

  const refreshUser = async () => {
    if (!token) {
      return null;
    }

    const response = await getCurrentUser(token);

    setUser(response.user);

    return response.user;
  };

  /* -------------------------------- */
  /* Logout                           */
  /* -------------------------------- */

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);

    setToken(null);

    setUser(null);
  };

  /* -------------------------------- */
  /* Delete account                   */
  /* -------------------------------- */

  const deleteAccount = async (password) => {
    if (!token) {
      throw new Error("Du måste vara inloggad.");
    }

    const response = await deleteUserAccount(token, password);

    /*
      Account has been deleted from MySQL.
      Remove the local login session too.
    */

    localStorage.removeItem(TOKEN_STORAGE_KEY);

    setToken(null);

    setUser(null);

    return response;
  };

  /* -------------------------------- */
  /* Context value                    */
  /* -------------------------------- */

  const value = useMemo(
    () => ({
      user,

      token,

      loading,

      isAuthenticated: Boolean(user && token),

      register,

      login,
      googleLogin,
      emailLinkLogin,

      logout,

      updateProfile,

      refreshUser,

      deleteAccount,
    }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
