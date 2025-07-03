import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api";

export interface HomeContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
  };
  features: {
    title: string;
    description: string;
    cards: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
    }>;
  };
  downloads: {
    title: string;
    description: string;
    items: Array<{
      id: string;
      title: string;
      description: string;
      type: "pdf" | "word" | "excel" | "link";
      url: string;
      size?: string;
    }>;
  };
  info: {
    title: string;
    description: string;
    sections: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
    }>;
  };
  gallery: {
    title: string;
    description: string;
    images: Array<{
      id: string;
      url: string;
      title: string;
      description: string;
    }>;
  };
}

// Hook para obtener el contenido del Home
export const useGetHomeContent = () => {
  return useQuery({
    queryKey: ["homeContent"],
    queryFn: async (): Promise<HomeContent> => {
      const response = await axiosInstance.get("/home/content");
      return response.data.data;
    },
  });
};

// Hook para actualizar el contenido del Home
export const useUpdateHomeContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: HomeContent): Promise<HomeContent> => {
      const response = await axiosInstance.put("/home/content", content);
      return response.data;
    },
    onSuccess: () => {
      // Invalidar y refetch el contenido del Home
      queryClient.invalidateQueries({ queryKey: ["homeContent"] });
    },
  });
};
