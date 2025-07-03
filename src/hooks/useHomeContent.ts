import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getHomeContent, updateHomeContent, type HomeContent } from "@/lib/api";

// Hook para obtener el contenido del Home
export const useGetHomeContent = () => {
  return useQuery({
    queryKey: ["homeContent"],
    queryFn: getHomeContent,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

// Hook para actualizar el contenido del Home
export const useUpdateHomeContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateHomeContent,
    onSuccess: () => {
      // Invalidar y refetch el contenido del Home
      queryClient.invalidateQueries({ queryKey: ["homeContent"] });
    },
  });
};

// Re-exportar la interfaz para mantener compatibilidad
export type { HomeContent };
