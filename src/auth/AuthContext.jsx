/* eslint react-refresh/only-export-components: off */
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiRequest } from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionError, setSessionError] = useState("");

  const refreshSession = useCallback(async () => {
    setLoading(true);
    setSessionError("");
    try {
      const response = await apiRequest("/api/auth/me");
      setUser(response.data.user);
    } catch (error) {
      if (error.status === 401) {
        setUser(null);
      } else {
        setSessionError(error.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = useCallback(async (credentials) => {
    const response = await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    setUser(response.data.user);
    setSessionError("");
    return response.data.user;
  }, []);

  const register = useCallback(async (userDetails) => {
    const response = await apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userDetails),
    });
    setUser(response.data.user);
    setSessionError("");
    return response.data.user;
  }, []);

  const logout = useCallback(async () => {
    await apiRequest("/api/auth/logout", { method: "POST" });
    setUser(null);
    setSessionError("");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        sessionError,
        login,
        register,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
};
