import { useQuery } from "@tanstack/react-query";
import { getUserSession } from "@/lib/api";
import { existsToken, isValidToken } from "@/lib/token";
import { useSession as useSessionContext } from "@/context/SessionContext";
import { useLocation } from "react-router-dom";

export default function useSession() {
  const {
    user,
    login,
    logout,
    setUser,
    isLoading: contextLoading,
    ...context
  } = useSessionContext();
  const location = useLocation();

  // Rutas públicas donde no necesitamos verificar la sesión
  const publicRoutes = ["/", "/post/", "/forgot-password", "/publicaciones-publicas"];
  const isPublicRoute = publicRoutes.some(
    (route) => location.pathname === route || location.pathname.startsWith(route)
  );

  // Solo hacer la consulta de sesión si no estamos en una ruta pública, hay token, y no tenemos usuario en el contexto
  const { data: sessionData, isLoading: queryLoading } = useQuery({
    queryKey: ["userSession"],
    queryFn: getUserSession,
    enabled: existsToken() && isValidToken() && !isPublicRoute && !user,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const isAuthenticated = existsToken() && isValidToken();

  // Si tenemos datos de sesión del servidor y no tenemos usuario en el contexto, actualizamos
  if (sessionData && !user) {
    setUser(sessionData);
  }

  return {
    user: user || sessionData,
    isAuthenticated,
    login,
    logout,
    setUser,
    isLoading: contextLoading || queryLoading,
    ...context,
  };
}
