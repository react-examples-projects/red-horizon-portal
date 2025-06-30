# API de Publicaciones (Posts)

Esta documentación describe todos los endpoints disponibles para el manejo de publicaciones en el sistema.

## Base URL

```
/api/posts
```

## Autenticación

La mayoría de endpoints requieren autenticación mediante token JWT en el header:

```
Authorization: Bearer <token>
```

## Endpoints

### 1. Obtener todas las publicaciones

**GET** `/api/posts`

**Query Parameters:**

- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Elementos por página (default: 10)
- `category` (opcional): Filtrar por categoría
- `search` (opcional): Buscar en título y descripción (case-insensitive)
- `author` (opcional): Filtrar por autor (ID)
- `dateFilter` (opcional): Filtrar por fecha exacta
  - `"all"` (default): Todas las fechas
  - `"today"`: Solo publicaciones creadas hoy (desde 00:00:00 hasta 23:59:59)
  - `"week"`: Última semana (desde hace 7 días hasta hoy)
  - `"month"`: Último mes (desde el primer día del mes actual hasta hoy)
  - `"YYYY-MM-DD"`: Fecha específica (ej: "2023-09-15" para posts del 15 de septiembre de 2023)

**Ejemplo:**

```bash
GET /api/posts?page=1&limit=5&category=tecnologia&search=javascript&dateFilter=week
```

**Ejemplos de filtros de fecha:**

```bash
# Todas las publicaciones
GET /api/posts?dateFilter=all

# Solo publicaciones creadas hoy
GET /api/posts?dateFilter=today

# Última semana
GET /api/posts?dateFilter=week

# Último mes
GET /api/posts?dateFilter=month

# Fecha específica (15 de septiembre de 2023)
GET /api/posts?dateFilter=2023-09-15

# Combinado con otros filtros
GET /api/posts?category=tecnologia&dateFilter=2023-09-15&page=1&limit=10
```

**Ejemplos de búsqueda:**

```bash
# Buscar posts que contengan "javascript" en título o descripción
GET /api/posts?search=javascript

# Buscar posts de tecnología que contengan "react"
GET /api/posts?category=tecnologia&search=react

# Buscar posts de esta semana que contengan "programación"
GET /api/posts?dateFilter=week&search=programación
```

**Respuesta con búsqueda:**

```json
{
  "success": true,
  "message": "Se encontraron 5 publicación(es) que contienen \"javascript\".",
  "data": {
    "posts": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "title": "Introducción a JavaScript",
        "category": "tecnologia",
        "description": "Guía completa para principiantes en JavaScript...",
        "images": ["url1", "url2"],
        "documents": ["doc1"],
        "author": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
          "name": "Juan Pérez",
          "email": "juan@example.com",
          "perfil_photo": "url_foto"
        },
        "isActive": true,
        "createdAt": "2023-09-06T10:30:00.000Z",
        "updatedAt": "2023-09-06T10:30:00.000Z"
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
      "query": "javascript",
      "resultsFound": 25,
      "hasResults": true
    }
  }
}
```

**Respuesta sin resultados de búsqueda:**

```json
{
  "success": true,
  "message": "No se encontraron publicaciones que contengan \"xyz123\" en el título o descripción.",
  "data": {
    "posts": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 0,
      "pages": 0
    },
    "searchInfo": {
      "query": "xyz123",
      "resultsFound": 0,
      "hasResults": false
    }
  }
}
```

### 2. Obtener publicación por ID

**GET** `/api/posts/:id`

**Ejemplo:**

```bash
GET /api/posts/64f8a1b2c3d4e5f6a7b8c9d0
```

### 3. Obtener publicaciones por categoría

**GET** `/api/posts/category/:category`

**Ejemplo:**

```bash
GET /api/posts/category/tecnologia
```

### 4. Obtener publicaciones por autor

**GET** `/api/posts/author/:authorId`

**Ejemplo:**

```bash
GET /api/posts/author/64f8a1b2c3d4e5f6a7b8c9d1
```

### 5. Crear nueva publicación

**POST** `/api/posts`

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (form-data):**

- `title` (string, **requerido**): Título de la publicación (3-200 caracteres)
- `category` (string, **requerido**): Categoría (2-50 caracteres)
- `description` (string, **requerido**): Descripción (10-2000 caracteres)
- `images` (file, **opcional**): Imágenes (máximo 10)
- `documents` (file, **opcional**): Documentos (máximo 5)

**Ejemplo con archivos:**

```bash
curl -X POST /api/posts \
  -H "Authorization: Bearer <token>" \
  -F "title=Mi nueva publicación" \
  -F "category=tecnologia" \
  -F "description=Esta es una descripción detallada..." \
  -F "images=@imagen1.jpg" \
  -F "images=@imagen2.jpg" \
  -F "documents=@documento.pdf"
```

**Ejemplo sin archivos (solo texto):**

```bash
curl -X POST /api/posts \
  -H "Authorization: Bearer <token>" \
  -F "title=Mi nueva publicación" \
  -F "category=tecnologia" \
  -F "description=Esta es una descripción detallada..."
```

**Nota:** Las imágenes y documentos son **completamente opcionales**. Puedes crear publicaciones solo con texto.

### 6. Actualizar publicación

**PATCH** `/api/posts/:id`

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**

```json
{
  "title": "Título actualizado",
  "category": "nueva_categoria",
  "description": "Descripción actualizada..."
}
```

**Nota:** Solo el autor puede actualizar su publicación.

### 7. Eliminar publicación

**DELETE** `/api/posts/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Nota:** Solo el autor puede eliminar su publicación. Se realiza un soft delete (marca como inactiva).

### 8. Obtener mis publicaciones

**GET** `/api/posts/me/posts`

**Headers:**

```
Authorization: Bearer <token>
```

**Nota:** Retorna solo las publicaciones del usuario autenticado.

## Códigos de Respuesta

- `200`: Operación exitosa
- `201`: Recurso creado exitosamente
- `400`: Error en la solicitud (validación fallida)
- `401`: No autorizado (token inválido o faltante)
- `403`: Prohibido (no tienes permisos)
- `404`: Recurso no encontrado
- `500`: Error interno del servidor

## Validaciones

### Crear/Actualizar publicación:

- **title**: 3-200 caracteres, **requerido** para crear
- **category**: 2-50 caracteres, **requerido** para crear
- **description**: 10-2000 caracteres, **requerido** para crear
- **images**: **Opcional**, máximo 10 imágenes
- **documents**: **Opcional**, máximo 5 documentos

### Archivos:

- **images**: Formato de imagen válido (solo si se suben)
- **documents**: Formato de documento válido (solo si se suben)

## Características del Modelo

- **Soft Delete**: Las publicaciones no se eliminan físicamente, se marcan como inactivas
- **Búsqueda de texto**: Búsqueda en título y descripción
- **Paginación**: Soporte para paginación en listados
- **Filtros**: Por categoría, autor y búsqueda de texto
- **Relaciones**: Populate automático del autor con información básica
- **Índices**: Optimizados para búsquedas y consultas frecuentes
- **Archivos opcionales**: Las publicaciones pueden existir sin imágenes ni documentos
- **Gestión de archivos**: Los archivos solo se pueden subir al crear la publicación
