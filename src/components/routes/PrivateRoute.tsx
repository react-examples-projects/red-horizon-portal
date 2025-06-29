import { Navigate } from "react-router-dom";
import useSession from "@/hooks/useSession";

function PrivateRoute({ children }) {
  const { user, isLoading, isAuthenticated } = useSession();

  if (isLoading) return null;

  if (isAuthenticated && user) {
    return children;
  }

  return <Navigate to="/" replace />;
}

export default PrivateRoute;
