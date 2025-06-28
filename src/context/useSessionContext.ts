import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeToken, setToken } from "@/lib/token";
import { removeUserData } from "@/lib/userData";
import { login as loginUser } from "@/lib/api";
const DEFAULT_STATE = { user: null };

export default function useSessionContext() {
  const [session, setSession] = useState(DEFAULT_STATE);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: loginUser,
  });
  const setUser = useCallback((user) => {
    setSession((prev) => ({
      ...prev,
      user: {
        ...user,
      },
    }));
  }, []);

  const logout = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["user"] });
    queryClient.removeQueries();
    removeToken();
    removeUserData();
    setSession(DEFAULT_STATE);
  }, [queryClient]);

  const login = async (email, password) => {
    try {
      const res = await mutation.mutateAsync({ email, password });
      const { user, token } = res;
      setUser(user);
      setToken(token);
      console.log({user})
      location.href = "/publicaciones";
    } catch (err) {
      console.error("Error during authentication:", err);
      throw new Error("Authentication failed");
    }
  };

  return { ...session, setSession, setUser, logout, login };
}
