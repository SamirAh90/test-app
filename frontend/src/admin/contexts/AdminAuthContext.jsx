import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { adminLogin, getCurrentAdmin } from "../services/adminApi";

const AdminAuthContext = createContext(null);

const ADMIN_TOKEN_KEY = "medborgatest_admin_token";

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem(ADMIN_TOKEN_KEY),
  );

  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreAdminSession() {
      if (!token) {
        setAdminUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await getCurrentAdmin(token);

        setAdminUser(response.user);
      } catch (error) {
        console.error("Could not restore admin session:", error);

        localStorage.removeItem(ADMIN_TOKEN_KEY);
        setToken(null);
        setAdminUser(null);
      } finally {
        setLoading(false);
      }
    }

    restoreAdminSession();
  }, [token]);

  const login = async (credentials) => {
    const response = await adminLogin(credentials);

    localStorage.setItem(ADMIN_TOKEN_KEY, response.token);

    setToken(response.token);
    setAdminUser(response.user);

    return response;
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken(null);
    setAdminUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      adminUser,
      loading,
      isAdminAuthenticated: Boolean(
        token && adminUser && ["editor", "admin"].includes(adminUser.role),
      ),
      isAdmin: adminUser?.role === "admin",
      isEditor: adminUser?.role === "editor" || adminUser?.role === "admin",
      login,
      logout,
    }),
    [token, adminUser, loading],
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error("useAdminAuth must be used inside AdminAuthProvider.");
  }

  return context;
}
