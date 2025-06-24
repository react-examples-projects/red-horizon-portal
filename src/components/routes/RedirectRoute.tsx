import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import useSession from "@/hooks/useSession";

function RedirectRoute({ children }) {
  const { setUser, user, isLoading, session } = useSession();
  useEffect(() => {
    if (session !== null && session !== undefined && !user) {
      setUser(session);
    }
  }, [session, setUser, user]);

  if (isLoading || (session && !user)) return null;

  if (session || user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}


export default RedirectRoute;
