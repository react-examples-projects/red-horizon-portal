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
    "/home/content",
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

// HomeContent API requests
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
      publicId?: string;
    }>;
  };
  info: {
    title: string;
    description: string;
    mainImage?: {
      url: string;
      title: string;
      description: string;
      publicId: string;
    } | null;
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
      publicId?: string;
    }>;
  };
}

export const getHomeContent = async (): Promise<HomeContent> => {
  const response = await axiosInstance.get("/home/content");
  return response.data.data;
};

export const updateHomeContent = async (content: HomeContent): Promise<HomeContent> => {
  console.log("updateHomeContent - Enviando contenido:", content);
  console.log("updateHomeContent - mainImage en contenido:", content.info.mainImage);

  const response = await axiosInstance.put("/home/content", content);
  console.log("updateHomeContent - Respuesta del servidor:", response.data);

  return response.data;
};

// Función para subir un archivo de descarga individual
export const uploadDownloadFile = async (
  file: File,
  title?: string,
  description?: string,
  type?: string,
  itemId?: string
): Promise<{
  file: {
    id: string;
    title: string;
    description: string;
    type: string;
    url: string;
    size: string;
    publicId: string;
  };
  content: HomeContent;
}> => {
  const formData = new FormData();
  formData.append("file", file);
  if (title) formData.append("title", title);
  if (description) formData.append("description", description);
  if (type) formData.append("type", type);
  if (itemId) formData.append("itemId", itemId);

  const response = await axiosInstance.post("/home/admin/upload-download", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
};

// Función para subir una imagen de galería individual
export const uploadGalleryImage = async (
  file: File,
  title?: string,
  description?: string,
  itemId?: string
): Promise<{
  image: {
    id: string;
    url: string;
    title: string;
    description: string;
    publicId: string;
  };
  content: HomeContent;
}> => {
  const formData = new FormData();
  formData.append("file", file);
  if (title) formData.append("title", title);
  if (description) formData.append("description", description);
  if (itemId) formData.append("itemId", itemId);

  const response = await axiosInstance.post("/home/admin/upload-gallery", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
};

// Función para subir la imagen principal de la sección de información
export const uploadInfoMainImage = async (
  file: File,
  title?: string,
  description?: string
): Promise<{
  image: {
    url: string;
    title: string;
    description: string;
    publicId: string;
  };
  content: HomeContent;
}> => {
  const formData = new FormData();
  formData.append("file", file);
  if (title) formData.append("title", title);
  if (description) formData.append("description", description);

  const response = await axiosInstance.post("/home/admin/upload-info-main-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
};

// Función para eliminar una imagen de galería
export const deleteGalleryImage = async (
  imageId: string
): Promise<{
  message: string;
  content: HomeContent;
}> => {
  const response = await axiosInstance.delete(`/home/admin/gallery/${imageId}`);
  return response.data.data;
};
