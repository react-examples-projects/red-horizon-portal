import { useState, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { removeToken, setToken, getToken, isValidToken } from "@/lib/token";
import { removeUserData } from "@/lib/userData";
import { login as loginUser, getUserSession } from "@/lib/api";

const DEFAULT_STATE = { user: null, isLoading: true };

export default function useSessionContext() {
  const [session, setSession] = useState(DEFAULT_STATE);
  const queryClient = useQueryClient();

  // Restaurar sesión al cargar si hay token válido
  useEffect(() => {
    const restoreSession = async () => {
      if (isValidToken()) {
        try {
          const userData = await getUserSession();
          setSession({ user: userData, isLoading: false });
        } catch (error) {
          console.error("Error restoring session:", error);
          // Si hay error al restaurar, limpiar token inválido
          removeToken();
          removeUserData();
          setSession({ user: null, isLoading: false });
        }
      } else {
        setSession({ user: null, isLoading: false });
      }
    };

    restoreSession();
  }, []);

  const setUser = useCallback((user) => {
    setSession((prev) => ({
      ...prev,
      user: {
        ...user,
      },
      isLoading: false,
    }));
  }, []);

  const logout = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["user"] });
    queryClient.removeQueries();
    removeToken();
    removeUserData();
    setSession({ user: null, isLoading: false });
  }, [queryClient]);

  const login = async (email, password) => {
    try {
      setSession((prev) => ({ ...prev, isLoading: true }));
      const res = await loginUser({ email, password });
      const { user, token } = res;
      setUser(user);
      setToken(token);
      return res;
    } catch (err) {
      setSession((prev) => ({ ...prev, isLoading: false }));
      console.error("Error during authentication:", err);
      throw new Error("Authentication failed");
    }
  };

  return { ...session, setSession, setUser, logout, login };
}
