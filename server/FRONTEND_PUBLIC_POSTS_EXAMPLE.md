# Ejemplo Frontend - Posts Públicos

## Componente React para Posts Públicos

### 1. Hook Personalizado para Posts Públicos

```jsx
// hooks/usePublicPosts.js
import { useState, useEffect } from "react";

export function usePublicPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchPosts = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`/api/posts?${queryString}`);
      const data = await response.json();

      if (data.ok) {
        setPosts(data.data.posts);
        setPagination(data.data.pagination);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return { posts, loading, error, pagination, fetchPosts };
}

export function usePublicPost(postId) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/posts/public/${postId}`);
      const data = await response.json();

      if (data.ok) {
        setPost(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  return { post, loading, error, refetch: fetchPost };
}
```

### 2. Componente de Lista de Posts Públicos

```jsx
// components/PublicPostsList.jsx
import React, { useState } from "react";
import { usePublicPosts } from "../hooks/usePublicPosts";

function PublicPostsList() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    category: "",
    search: "",
    dateFilter: "all",
  });

  const { posts, loading, error, pagination, fetchPosts } = usePublicPosts();

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    fetchPosts(newFilters);
  };

  const handlePageChange = (page) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    fetchPosts(newFilters);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-medium">Error al cargar posts</h3>
        <p className="text-red-600">{error.message || "Error desconocido"}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Filtros</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              placeholder="Buscar en título y descripción..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <input
              type="text"
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              placeholder="Filtrar por categoría..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtro de fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <select
              value={filters.dateFilter}
              onChange={(e) => handleFilterChange("dateFilter", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas las fechas</option>
              <option value="today">Hoy</option>
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
            </select>
          </div>

          {/* Elementos por página */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Por página</label>
            <select
              value={filters.limit}
              onChange={(e) => handleFilterChange("limit", parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Posts */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron posts</h3>
            <p className="text-gray-600">
              {filters.search
                ? `No hay posts que contengan "${filters.search}"`
                : "No hay posts disponibles en este momento"}
            </p>
          </div>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        )}
      </div>

      {/* Paginación */}
      {pagination && pagination.pages > 1 && (
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          currentPage={filters.page}
        />
      )}
    </div>
  );
}

export default PublicPostsList;
```

### 3. Componente de Tarjeta de Post

```jsx
// components/PostCard.jsx
import React from "react";
import { Link } from "react-router-dom";

function PostCard({ post }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={post.author.perfil_photo || "/default-avatar.png"}
              alt={post.author.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-gray-900">{post.author.name}</p>
              <p className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            {post.category}
          </span>
        </div>

        {/* Contenido */}
        <div className="mb-4">
          <Link to={`/posts/public/${post._id}`} className="block group">
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
              {post.title}
            </h3>
          </Link>
          <p className="text-gray-600 line-clamp-3">{post.description}</p>
        </div>

        {/* Imágenes */}
        {post.images && post.images.length > 0 && (
          <div className="mb-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {post.images.slice(0, 3).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-24 object-cover rounded-md"
                />
              ))}
              {post.images.length > 3 && (
                <div className="w-full h-24 bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="text-gray-500 text-sm">+{post.images.length - 3} más</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Documentos */}
        {post.documents && post.documents.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Documentos:</h4>
            <div className="flex flex-wrap gap-2">
              {post.documents.map((doc, index) => (
                <a
                  key={index}
                  href={doc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Documento {index + 1}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <Link
            to={`/posts/public/${post._id}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            Leer más →
          </Link>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>{post.images?.length || 0} imágenes</span>
            <span>{post.documents?.length || 0} documentos</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
```

### 4. Componente de Post Individual Público

```jsx
// components/PublicPostDetail.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { usePublicPost } from "../hooks/usePublicPosts";

function PublicPostDetail() {
  const { id } = useParams();
  const { post, loading, error } = usePublicPost(id);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-red-800 text-xl font-semibold mb-2">Error al cargar el post</h2>
          <p className="text-red-600 mb-4">
            {error.message || "No se pudo cargar el post solicitado"}
          </p>
          <Link
            to="/posts"
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            ← Volver a los posts
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Post no encontrado</h2>
          <p className="text-gray-600 mb-4">El post que buscas no existe o ha sido eliminado</p>
          <Link
            to="/posts"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            ← Volver a los posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link to="/posts" className="hover:text-blue-600">
              Posts
            </Link>
          </li>
          <li>
            <span>/</span>
          </li>
          <li>
            <Link to={`/posts/category/${post.category}`} className="hover:text-blue-600">
              {post.category}
            </Link>
          </li>
          <li>
            <span>/</span>
          </li>
          <li className="text-gray-900 truncate">{post.title}</li>
        </ol>
      </nav>

      {/* Header del Post */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={post.author.perfil_photo || "/default-avatar.png"}
              alt={post.author.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-gray-900">{post.author.name}</p>
              <p className="text-sm text-gray-500">{post.author.email}</p>
            </div>
          </div>
          <span className="px-4 py-2 bg-blue-100 text-blue-800 font-medium rounded-full">
            {post.category}
          </span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span>
            Publicado el{" "}
            {new Date(post.createdAt).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {post.updatedAt !== post.createdAt && (
            <>
              <span className="mx-2">•</span>
              <span>
                Actualizado el{" "}
                {new Date(post.updatedAt).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </>
          )}
        </div>

        <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
          {post.description}
        </p>
      </div>

      {/* Imágenes */}
      {post.images && post.images.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Imágenes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {post.images.map((image, index) => (
              <div key={index} className="group">
                <img
                  src={image}
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg group-hover:opacity-90 transition-opacity cursor-pointer"
                  onClick={() => window.open(image, "_blank")}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documentos */}
      {post.documents && post.documents.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Documentos</h2>
          <div className="space-y-3">
            {post.documents.map((doc, index) => (
              <a
                key={index}
                href={doc}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <svg className="w-8 h-8 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Documento {index + 1}</p>
                  <p className="text-sm text-gray-500">Haz clic para descargar</p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400 ml-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Mensaje de Post Público */}
      {post.message && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-blue-800">{post.message}</p>
          </div>
        </div>
      )}

      {/* Botón de regreso */}
      <div className="text-center">
        <Link
          to="/posts"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          ← Volver a todos los posts
        </Link>
      </div>
    </div>
  );
}

export default PublicPostDetail;
```

### 5. Componente de Paginación

```jsx
// components/Pagination.jsx
import React from "react";

function Pagination({ pagination, onPageChange, currentPage }) {
  const { pages, hasNextPage, hasPrevPage, nextPage, prevPage } = pagination;

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5;

    if (pages <= maxVisible) {
      for (let i = 1; i <= pages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(pages);
      } else if (currentPage >= pages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = pages - 3; i <= pages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(pages);
      }
    }

    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      {/* Botón Anterior */}
      <button
        onClick={() => onPageChange(prevPage)}
        disabled={!hasPrevPage}
        className={`px-3 py-2 rounded-md text-sm font-medium ${
          hasPrevPage
            ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        Anterior
      </button>

      {/* Números de página */}
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={page === "..."}
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            page === currentPage
              ? "bg-blue-600 text-white"
              : page === "..."
              ? "text-gray-400 cursor-default"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Botón Siguiente */}
      <button
        onClick={() => onPageChange(nextPage)}
        disabled={!hasNextPage}
        className={`px-3 py-2 rounded-md text-sm font-medium ${
          hasNextPage
            ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        Siguiente
      </button>
    </div>
  );
}

export default Pagination;
```

### 6. Configuración de Rutas

```jsx
// App.jsx o tu archivo de rutas
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicPostsList from "./components/PublicPostsList";
import PublicPostDetail from "./components/PublicPostDetail";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/posts" element={<PublicPostsList />} />
          <Route path="/posts/public/:id" element={<PublicPostDetail />} />
          {/* Otras rutas... */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
```

## Características del Ejemplo

### ✅ **Sin Autenticación**

- Todos los componentes funcionan sin token
- Accesible para cualquier usuario
- No requiere login

### ✅ **Funcionalidades Completas**

- Lista paginada de posts
- Filtros de búsqueda, categoría y fecha
- Vista detallada de posts individuales
- Visualización de imágenes y documentos
- Información completa del autor

### ✅ **UX/UI Moderna**

- Diseño responsive
- Estados de carga y error
- Transiciones suaves
- Componentes reutilizables

### ✅ **Integración con API**

- Hooks personalizados para manejo de estado
- Manejo de errores robusto
- Paginación completa
- Filtros dinámicos

Este ejemplo proporciona una implementación completa para mostrar posts públicos sin necesidad de autenticación, con todas las funcionalidades de filtrado, búsqueda y paginación que ya tienes implementadas en tu API.
