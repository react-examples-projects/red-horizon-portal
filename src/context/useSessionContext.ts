import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { removeToken } from "@/lib/token";
import { removeUserData } from "@/lib/userData";

const DEFAULT_STATE = { user: null };

export default function useSessionContext() {
  const [session, setSession] = useState(DEFAULT_STATE);
  const queryClient = useQueryClient();

  const setUser = useCallback((user) => {
    setSession((prev) => ({
      ...prev,
      user: {
        ...user,
        isAdmin: user?.role === "fiba",
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

  return { ...session, setSession, setUser, logout };
}
