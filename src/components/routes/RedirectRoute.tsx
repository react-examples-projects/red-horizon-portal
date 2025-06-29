import { Navigate } from "react-router-dom";
import useSession from "@/hooks/useSession";

function RedirectRoute({ children }) {
  const { user, isLoading, isAuthenticated } = useSession();

  if (isLoading) return null;

  if (isAuthenticated && user) {
    return <Navigate to="/publicaciones" replace />;
  }

  return children;
}

export default RedirectRoute;
