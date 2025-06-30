# API de Posts Públicos - Documentación

## Descripción

Esta documentación describe las rutas públicas disponibles para acceder a posts sin necesidad de autenticación. Estas rutas permiten a cualquier usuario (logeado o no) ver contenido público.

## Rutas Públicas Disponibles

### 1. Ver Todos los Posts Públicos

**Endpoint:** `GET /api/posts`

**Descripción:** Obtiene una lista paginada de todos los posts públicos con opciones de filtrado, búsqueda y paginación.

**Parámetros de Query (opcionales):**

- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10, máximo: 100)
- `category`: Filtrar por categoría
- `search`: Buscar en título y descripción
- `author`: Filtrar por autor (ID del autor)
- `dateFilter`: Filtro de fecha ("all", "today", "week", "month", o "YYYY-MM-DD")

**Ejemplo de Request:**

```bash
GET /api/posts?page=1&limit=10&category=Tecnología&search=React
```

**Respuesta Exitosa (200):**

```json
{
  "ok": true,
  "error": false,
  "data": {
    "posts": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "title": "Introducción a React",
        "category": "Tecnología",
        "description": "Aprende los fundamentos de React...",
        "images": ["https://res.cloudinary.com/..."],
        "documents": ["https://res.cloudinary.com/..."],
        "author": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
          "name": "Juan Pérez",
          "email": "juan@ejemplo.com",
          "perfil_photo": "https://res.cloudinary.com/..."
        },
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3,
      "hasNextPage": true,
      "hasPrevPage": false,
      "nextPage": 2,
      "prevPage": null,
      "showing": {
        "from": 1,
        "to": 10,
        "total": 25
      }
    },
    "searchInfo": {
      "query": "React",
      "resultsFound": 5,
      "hasResults": true
    }
  },
  "statusCode": 200
}
```

### 2. Ver Post Individual Público (Ruta Original)

**Endpoint:** `GET /api/posts/:id`

**Descripción:** Obtiene un post específico por su ID. Esta es la ruta original que funciona para posts públicos.

**Parámetros:**

- `id`: ID del post (ObjectId)

**Ejemplo de Request:**

```bash
GET /api/posts/64f8a1b2c3d4e5f6a7b8c9d0
```

**Respuesta Exitosa (200):**

```json
{
  "ok": true,
  "error": false,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "title": "Introducción a React",
    "category": "Tecnología",
    "description": "Aprende los fundamentos de React...",
    "images": ["https://res.cloudinary.com/..."],
    "documents": ["https://res.cloudinary.com/..."],
    "author": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "Juan Pérez",
      "email": "juan@ejemplo.com",
      "perfil_photo": "https://res.cloudinary.com/..."
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "statusCode": 200
}
```

### 3. Ver Post Individual Público (Ruta Específica)

**Endpoint:** `GET /api/posts/public/:id`

**Descripción:** Obtiene un post específico por su ID con mensaje explícito de que es una ruta pública. Esta ruta es más descriptiva y clara sobre su propósito.

**Parámetros:**

- `id`: ID del post (ObjectId)

**Ejemplo de Request:**

```bash
GET /api/posts/public/64f8a1b2c3d4e5f6a7b8c9d0
```

**Respuesta Exitosa (200):**

```json
{
  "ok": true,
  "error": false,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "title": "Introducción a React",
    "category": "Tecnología",
    "description": "Aprende los fundamentos de React...",
    "images": ["https://res.cloudinary.com/..."],
    "documents": ["https://res.cloudinary.com/..."],
    "author": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "Juan Pérez",
      "email": "juan@ejemplo.com",
      "perfil_photo": "https://res.cloudinary.com/..."
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "statusCode": 200
}
```

### 4. Ver Posts por Categoría

**Endpoint:** `GET /api/posts/category/:category`

**Descripción:** Obtiene todos los posts de una categoría específica.

**Parámetros:**

- `category`: Nombre de la categoría

**Ejemplo de Request:**

```bash
GET /api/posts/category/Tecnología
```

## Características de las Rutas Públicas

### ✅ **Sin Autenticación Requerida**

- No necesitas token de acceso
- Accesible para cualquier usuario
- No requiere registro previo

### ✅ **Información Completa del Post**

- Título, categoría y descripción
- Imágenes y documentos (URLs de Cloudinary)
- Información del autor (nombre, email, foto de perfil)
- Fechas de creación y actualización

### ✅ **Filtros y Búsqueda**

- Filtrado por categoría
- Búsqueda en título y descripción
- Filtrado por autor
- Filtros de fecha predefinidos y personalizados
- Paginación completa

### ✅ **Manejo de Errores**

- Posts no encontrados
- IDs inválidos
- Categorías inexistentes
- Errores de validación

## Ejemplos de Uso

### JavaScript (Frontend)

```javascript
// Obtener todos los posts
async function getPublicPosts() {
  const response = await fetch("/api/posts");
  const data = await response.json();
  return data;
}

// Obtener un post específico
async function getPublicPost(postId) {
  const response = await fetch(`/api/posts/public/${postId}`);
  const data = await response.json();
  return data;
}

// Buscar posts
async function searchPosts(query) {
  const response = await fetch(`/api/posts?search=${encodeURIComponent(query)}`);
  const data = await response.json();
  return data;
}

// Filtrar por categoría
async function getPostsByCategory(category) {
  const response = await fetch(`/api/posts/category/${encodeURIComponent(category)}`);
  const data = await response.json();
  return data;
}
```

### React Hook

```jsx
import { useState, useEffect } from "react";

function usePublicPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async (params = {}) => {
    try {
      setLoading(true);
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`/api/posts?${queryString}`);
      const data = await response.json();

      if (data.ok) {
        setPosts(data.data);
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

  return { posts, loading, error, fetchPosts };
}
```

### cURL

```bash
# Obtener todos los posts
curl -X GET http://localhost:3000/api/posts

# Obtener un post específico
curl -X GET http://localhost:3000/api/posts/public/64f8a1b2c3d4e5f6a7b8c9d0

# Buscar posts
curl -X GET "http://localhost:3000/api/posts?search=React&category=Tecnología"

# Posts por categoría
curl -X GET http://localhost:3000/api/posts/category/Tecnología
```

## Respuestas de Error

### Post No Encontrado (404)

```json
{
  "ok": false,
  "error": {
    "name": "Error",
    "data": "Publicación no encontrada"
  }
}
```

### ID Inválido (400)

```json
{
  "ok": false,
  "error": {
    "name": "ValidationError",
    "data": {
      "params.id": "El identificador es requerido"
    }
  }
}
```

## Notas Importantes

1. **Solo Posts Activos**: Solo se muestran posts con `isActive: true`
2. **Información del Autor**: Se incluye información básica del autor (nombre, email, foto)
3. **URLs Seguras**: Todas las URLs de archivos usan HTTPS
4. **Paginación**: Las listas incluyen información completa de paginación
5. **Búsqueda Case-Insensitive**: La búsqueda no distingue entre mayúsculas y minúsculas
6. **Filtros Combinables**: Puedes combinar múltiples filtros en una sola consulta

## Diferencias entre Rutas

| Ruta                    | Propósito                      | Mensaje Especial |
| ----------------------- | ------------------------------ | ---------------- |
| `/api/posts/:id`        | Post público (ruta original)   | No               |
| `/api/posts/public/:id` | Post público (ruta específica) | No               |

Ambas rutas devuelven la misma información y funcionan de manera idéntica.
