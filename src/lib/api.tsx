import axios from "axios";
import { getToken, isValidToken, removeToken } from "./token";

export const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
});

axiosInstance.interceptors.request.use((req) => {
  const allowedUrls = [
    "/auth/signup",
    "/auth/login",
    "/auth/reset-password",
    "/auth/recover-password",
    "/posts",
    "/user",
  ];
  const resetPatterns = [/^\/reset\/[a-zA-Z0-9]+$/, /^\/resetAdmin\/[a-zA-Z0-9]+$/];
  const publicPostPattern = /^\/posts\/public\/[a-zA-Z0-9]+$/;
  const postsPattern = /^\/posts(\?.*)?$/;
  const matchCurrentUrl = resetPatterns.some((pattern) => pattern.test(req.url));
  const matchPublicPost = publicPostPattern.test(req.url);
  const matchPosts = postsPattern.test(req.url);
  const isAllowedUrl =
    allowedUrls.includes(req.url) || matchCurrentUrl || matchPublicPost || matchPosts;

  // Solo redirigir si no es una URL permitida y no hay token válido
  if (!isAllowedUrl && !isValidToken()) {
    if (getToken()) removeToken();
    window.location.href = "/";
    return Promise.reject(new Error("Invalid session, please login again"));
  }

  if (isValidToken()) {
    req.headers.authorization = `Bearer ${getToken()}`;
  }

  return req;
});

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    const { code, message, response } = err || {};
    const { data, config, status } = response || {};

    if (code === "ERR_NETWORK") {
      return Promise.reject(data?.data ?? message);
    }

    const isNotAuthorized = data?.statusCode === 401 || status === 401 || status === 403;
    const isUrlsNotValid = config?.url !== "/user" && config?.url !== "/auth/login";

    if ((isNotAuthorized && isUrlsNotValid) || (status === 403 && config?.url === "/user")) {
      removeToken();
    }

    return Promise.reject(data?.data ?? err);
  }
);

export const getUserSession = async () => {
  const response = await axiosInstance.get("/user");
  return response.data?.data;
};

export const login = async (auth) => {
  const res = await axiosInstance.post("/auth/login", auth);
  return res.data?.data;
};

// Posts API requests
export const getAllPosts = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  author?: string;
  dateFilter?: string;
}) => {
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.category) searchParams.append("category", params.category);
  if (params?.search) searchParams.append("search", params.search);
  if (params?.author) searchParams.append("author", params.author);
  if (params?.dateFilter) searchParams.append("dateFilter", params.dateFilter);

  const queryString = searchParams.toString();
  const url = queryString ? `/posts?${queryString}` : "/posts";

  const response = await axiosInstance.get(url);

  // El backend devuelve: { ok: true, data: { posts: [], pagination: {} } }
  // Necesitamos devolver directamente el contenido de data
  return response.data?.data;
};

export const getPostsByCategory = async (category: string) => {
  const response = await axiosInstance.get(`/posts/category/${category}`);
  return response.data?.data;
};

export const getPostsByAuthor = async (authorId: string) => {
  const response = await axiosInstance.get(`/posts/author/${authorId}`);
  return response.data?.data;
};

export const getPostById = async (id: string) => {
  const response = await axiosInstance.get(`/posts/${id}`);
  return response.data?.data;
};

export const createPost = async (postData: {
  title: string;
  description: string;
  category: string;
  images?: File[];
  documents?: File[];
}) => {
  const formData = new FormData();

  // Agregar datos básicos
  formData.append("title", postData.title);
  formData.append("description", postData.description);
  formData.append("category", postData.category);

  // Agregar imágenes si existen
  if (postData.images && postData.images.length > 0) {
    postData.images.forEach((image) => {
      formData.append("images", image);
    });
  }

  // Agregar documentos si existen
  if (postData.documents && postData.documents.length > 0) {
    postData.documents.forEach((document) => {
      formData.append("documents", document);
    });
  }

  const response = await axiosInstance.post("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data?.data;
};

export const updatePost = async (
  id: string,
  postData: {
    title?: string;
    description?: string;
    category?: string;
  }
) => {
  const response = await axiosInstance.patch(`/posts/${id}`, postData);
  return response.data?.data;
};

export const updatePostWithFiles = async (
  id: string,
  postData: {
    title?: string;
    description?: string;
    category?: string;
    images?: File[];
    documents?: File[];
    imagesToDelete?: string[];
    documentsToDelete?: string[];
  }
) => {
  const formData = new FormData();

  // Agregar datos básicos
  if (postData.title) formData.append("title", postData.title);
  if (postData.description) formData.append("description", postData.description);
  if (postData.category) formData.append("category", postData.category);

  // Agregar nuevas imágenes si existen
  if (postData.images && postData.images.length > 0) {
    postData.images.forEach((image) => {
      formData.append("images", image);
    });
  }

  // Agregar nuevos documentos si existen
  if (postData.documents && postData.documents.length > 0) {
    postData.documents.forEach((document) => {
      formData.append("documents", document);
    });
  }

  // Agregar IDs de imágenes a eliminar como JSON string
  if (postData.imagesToDelete && postData.imagesToDelete.length > 0) {
    formData.append("imagesToDelete", JSON.stringify(postData.imagesToDelete));
  }

  // Agregar IDs de documentos a eliminar como JSON string
  if (postData.documentsToDelete && postData.documentsToDelete.length > 0) {
    formData.append("documentsToDelete", JSON.stringify(postData.documentsToDelete));
  }

  const response = await axiosInstance.patch(`/posts/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data?.data;
};

export const deletePost = async (id: string) => {
  const response = await axiosInstance.delete(`/posts/${id}`);
  return response.data?.data;
};

export const getMyPosts = async () => {
  const response = await axiosInstance.get("/posts/me/posts");
  return response.data?.data;
};

// Public API requests (sin autenticación)
export const getPublicPostById = async (id: string) => {
  const response = await axiosInstance.get(`/posts/public/${id}`);
  return response.data?.data;
};

// Stats API request
export const getPostsStats = async () => {
  const response = await axiosInstance.get("/posts/stats");
  return response.data?.data;
};
