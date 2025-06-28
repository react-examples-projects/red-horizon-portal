import { useQuery } from "@tanstack/react-query";
import { getUserSession } from "@/lib/api";
import { existsToken, isValidToken } from "@/lib/token";
import { useSession as useSessionContext } from "@/context/SessionContext";

export default function useSession() {
  const { user, ...context } = useSessionContext();

  const { data: session = user, ...args } = useQuery({
    queryKey: ["userSession"],
    queryFn: getUserSession,
    enabled: existsToken() && isValidToken(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const isAuthenticated = existsToken() && isValidToken();

  // console.log({ session, user, isAuthenticated });

  return {
    session,
    user,
    isAuthenticated,
    ...context,
    ...args,
  };
}
