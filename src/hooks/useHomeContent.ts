import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getHomeContent,
  updateHomeContent,
  uploadDownloadFile,
  uploadGalleryImage,
  uploadInfoMainImage,
  type HomeContent,
} from "@/lib/api";

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
    mutationFn: async (data: HomeContent | FormData): Promise<HomeContent> => {
      console.log("useUpdateHomeContent - Iniciando actualización:", data);

      if (data instanceof FormData) {
        // Si es FormData, usar la función que maneja archivos
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/home/content`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: data,
        });

        if (!response.ok) {
          throw new Error("Error al actualizar el contenido");
        }

        const result = await response.json();
        console.log("useUpdateHomeContent - Respuesta FormData:", result);
        return result.data;
      } else {
        // Si es un objeto normal, usar la función existente
        console.log("useUpdateHomeContent - Enviando objeto:", data);
        const result = await updateHomeContent(data);
        console.log("useUpdateHomeContent - Respuesta objeto:", result);
        return result;
      }
    },
    onSuccess: (data) => {
      console.log("useUpdateHomeContent - Actualización exitosa:", data);
      // Invalidar y refetch el contenido del Home
      queryClient.invalidateQueries({ queryKey: ["homeContent"] });
    },
    onError: (error) => {
      console.error("useUpdateHomeContent - Error:", error);
    },
  });
};

// Hook para subir un archivo de descarga individual
export const useUploadDownloadFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      title,
      description,
      type,
      itemId,
    }: {
      file: File;
      title?: string;
      description?: string;
      type?: string;
      itemId?: string;
    }) => {
      console.log("useUploadDownloadFile - Iniciando subida:", {
        file,
        title,
        description,
        type,
        itemId,
      });
      const result = await uploadDownloadFile(file, title, description, type, itemId);
      console.log("useUploadDownloadFile - Resultado:", result);
      return result;
    },
    onSuccess: (data) => {
      console.log("useUploadDownloadFile - Subida exitosa:", data);
      // Actualizar el cache con el contenido actualizado
      queryClient.setQueryData(["homeContent"], data.content);
      // También invalidar para asegurar sincronización
      queryClient.invalidateQueries({ queryKey: ["homeContent"] });
    },
    onError: (error) => {
      console.error("useUploadDownloadFile - Error:", error);
    },
  });
};

// Hook para subir una imagen de galería individual
export const useUploadGalleryImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      title,
      description,
      itemId,
    }: {
      file: File;
      title?: string;
      description?: string;
      itemId?: string;
    }) => {
      console.log("useUploadGalleryImage - Iniciando subida:", {
        file,
        title,
        description,
        itemId,
      });
      const result = await uploadGalleryImage(file, title, description, itemId);
      console.log("useUploadGalleryImage - Resultado:", result);
      return result;
    },
    onSuccess: (data) => {
      console.log("useUploadGalleryImage - Subida exitosa:", data);
      // Actualizar el cache con el contenido actualizado
      queryClient.setQueryData(["homeContent"], data.content);
      // También invalidar para asegurar sincronización
      queryClient.invalidateQueries({ queryKey: ["homeContent"] });
    },
    onError: (error) => {
      console.error("useUploadGalleryImage - Error:", error);
    },
  });
};

// Hook para subir la imagen principal de la sección de información
export const useUploadInfoMainImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      title,
      description,
    }: {
      file: File;
      title?: string;
      description?: string;
    }) => {
      console.log("useUploadInfoMainImage - Iniciando subida:", { file, title, description });
      const result = await uploadInfoMainImage(file, title, description);
      console.log("useUploadInfoMainImage - Resultado:", result);
      return result;
    },
    onSuccess: (data) => {
      console.log("useUploadInfoMainImage - Subida exitosa:", data);
      // Invalidar y refetch el contenido del Home
      queryClient.invalidateQueries({ queryKey: ["homeContent"] });
    },
    onError: (error) => {
      console.error("useUploadInfoMainImage - Error:", error);
    },
  });
};

// Re-exportar la interfaz para mantener compatibilidad
export type { HomeContent };
