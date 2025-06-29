import { Loader2 } from "lucide-react";
import useSession from "@/hooks/useSession";

interface SessionLoaderProps {
  children: React.ReactNode;
}

const SessionLoader = ({ children }: SessionLoaderProps) => {
  const { isLoading } = useSession();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando sesión...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default SessionLoader;
