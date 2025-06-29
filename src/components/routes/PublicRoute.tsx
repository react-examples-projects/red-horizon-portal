import useSession from "@/hooks/useSession";

function PublicRoute({ children }) {
  const { isLoading } = useSession();

  if (isLoading) return null;

  return children;
}

export default PublicRoute;
