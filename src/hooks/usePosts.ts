import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import {
  getAllPosts,
  getPostsByCategory,
  getPostsByAuthor,
  getPostById,
  getPublicPostById,
  createPost,
  updatePost,
  updatePostWithFiles,
  deletePost,
  getMyPosts,
  getPostsStats,
} from "@/lib/api";
import { Publication } from "@/types/Publication";

// Query Keys
export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (filters: string) => [...postKeys.lists(), { filters }] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
  public: () => [...postKeys.all, "public"] as const,
  publicDetail: (id: string) => [...postKeys.public(), id] as const,
  myPosts: () => [...postKeys.all, "my-posts"] as const,
  byCategory: (category: string) => [...postKeys.all, "category", category] as const,
  byAuthor: (authorId: string) => [...postKeys.all, "author", authorId] as const,
  infinite: () => [...postKeys.all, "infinite"] as const,
  stats: () => [...postKeys.all, "stats"] as const,
};

// Hooks para obtener datos
export const useGetAllPosts = (params?: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  author?: string;
  dateFilter?: string;
}) => {
  return useQuery({
    queryKey: [...postKeys.lists(), params],
    queryFn: () => getAllPosts(params),
  });
};

export const useGetLatestPosts = (limit: number = 10) => {
  return useQuery({
    queryKey: [...postKeys.lists(), "latest", limit],
    queryFn: () => getAllPosts({ limit, page: 1 }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useGetInfinitePosts = (params?: {
  limit?: number;
  category?: string;
  search?: string;
  author?: string;
  dateFilter?: string;
}) => {
  return useInfiniteQuery({
    queryKey: [...postKeys.infinite(), params],
    queryFn: ({ pageParam = 1 }) => getAllPosts({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasNextPage) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
};

export const useGetPostsByCategory = (category: string) => {
  return useQuery({
    queryKey: postKeys.byCategory(category),
    queryFn: () => getPostsByCategory(category),
    enabled: !!category,
  });
};

export const useGetPostsByAuthor = (authorId: string) => {
  return useQuery({
    queryKey: postKeys.byAuthor(authorId),
    queryFn: () => getPostsByAuthor(authorId),
    enabled: !!authorId,
  });
};

export const useGetPostById = (id: string) => {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => getPostById(id),
    enabled: !!id,
  });
};

export const useGetPublicPostById = (id: string) => {
  return useQuery({
    queryKey: postKeys.publicDetail(id),
    queryFn: () => getPublicPostById(id),
    enabled: !!id,
  });
};

export const useGetMyPosts = () => {
  return useQuery({
    queryKey: postKeys.myPosts(),
    queryFn: getMyPosts,
  });
};

export const useGetPostsStats = () => {
  return useQuery({
    queryKey: postKeys.stats(),
    queryFn: getPostsStats,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// Hooks para mutaciones
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      // Invalidar todas las listas de posts
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.myPosts() });
      queryClient.invalidateQueries({ queryKey: postKeys.infinite() });
      queryClient.invalidateQueries({ queryKey: postKeys.stats() });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Publication> }) => updatePost(id, data),
    onSuccess: (data, variables) => {
      // Actualizar el post específico en el cache
      queryClient.setQueryData(postKeys.detail(variables.id), data);
      // Invalidar listas relacionadas
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.myPosts() });
      queryClient.invalidateQueries({ queryKey: postKeys.infinite() });
      queryClient.invalidateQueries({ queryKey: postKeys.stats() });
    },
  });
};

export const useUpdatePostWithFiles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updatePostWithFiles(id, data),
    onSuccess: (data, variables) => {
      // Actualizar el post específico en el cache
      queryClient.setQueryData(postKeys.detail(variables.id), data);
      // Invalidar listas relacionadas
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.myPosts() });
      queryClient.invalidateQueries({ queryKey: postKeys.infinite() });
      queryClient.invalidateQueries({ queryKey: postKeys.stats() });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: (_, deletedId) => {
      // Remover el post del cache
      queryClient.removeQueries({ queryKey: postKeys.detail(deletedId) });
      // Invalidar listas relacionadas
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.myPosts() });
      queryClient.invalidateQueries({ queryKey: postKeys.infinite() });
      queryClient.invalidateQueries({ queryKey: postKeys.stats() });
    },
  });
};
