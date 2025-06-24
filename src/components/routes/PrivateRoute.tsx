import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import useSession from "@/hooks/useSession";

function PrivateRoute({ children }) {
  const { setUser, user, isLoading, session } = useSession();
  useEffect(() => {
    if (session !== null && session !== undefined && !user) {
      setUser(session);
    }
  }, [session, setUser, user]);

  if (isLoading || (session && !user)) return null;

  if (session || user) {
    return children;
  }

  return <Navigate to="/" replace />;
}

export default PrivateRoute;
