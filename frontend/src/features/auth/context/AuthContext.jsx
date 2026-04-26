import { createContext, useContext } from "react";
import { authApi } from "../services/authApi";
import { storage } from "../../../shared/lib/storage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const handleRegister = async (name, username, password) => {
    const data = await authApi.register({ name, username, password });
    return data?.message;
  };

  const handleLogin = async (username, password) => {
    const { token } = await authApi.login({ username, password });
    storage.setToken(token);
  };

  const handleLogout = () => {
    storage.clearToken();
  };

  const verifyToken = async () => {
    try {
      await authApi.verify();
      return true;
    } catch {
      return false;
    }
  };

  const getHistoryOfUser = () => authApi.getHistory();

  const addToUserHistory = (meetingCode) => authApi.addHistory({ meetingCode });

  const value = {
    handleRegister,
    handleLogin,
    handleLogout,
    verifyToken,
    getHistoryOfUser,
    addToUserHistory,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
