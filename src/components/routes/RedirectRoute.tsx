import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import useSession from "@/hooks/useSession";

function RedirectRoute({ children }) {
  const { setUser, user, isLoading, session } = useSession();

  useEffect(() => {
    console.log({ session });
    if (session !== null && session !== undefined && !user) {
      setUser(session);
    }
  }, [session, setUser, user]);

  if (isLoading || (session && !user)) return null;

  if (!isLoading && session && !user) {
    return null; // Prevents rendering if session exists but user is not set
  }

  if (session || user) {
    return <Navigate to="/publicaciones" replace />;
  }

  return children;
}

export default RedirectRoute;
