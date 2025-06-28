
import { useEffect } from "react";
import useSession from "@/hooks/useSession";

function PublicRoute({ children }) {
  const { setUser, user, isLoading, session } = useSession();

  useEffect(() => {
    if (session !== null && session !== undefined && !user) {
      setUser(session);
    }
  }, [session, setUser, user]);

  if (isLoading) return null;

  if(!isLoading && session && !user){
    return null; // Prevents rendering if session exists but user is not set
  }

  console.log({ session, user });

  return children;
}

export default PublicRoute;
