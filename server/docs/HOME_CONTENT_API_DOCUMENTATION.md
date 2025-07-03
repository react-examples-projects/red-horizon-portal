# API de Contenido del Home - Documentación

Esta documentación describe todas las APIs disponibles para gestionar el contenido de la página principal (Home) del portal.

## Base URL

```
http://localhost:3000/api/home
```

## Autenticación

Las rutas privadas requieren un token JWT válido en el header de autorización:

```
Authorization: Bearer <token>
```

---

## 1. Obtener Contenido del Home (Público)

### GET `/api/home`

Obtiene el contenido activo de la página principal.

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Contenido del Home obtenido exitosamente",
  "data": {
    "hero": {
      "title": "Bienvenidos a",
      "subtitle": "Aldea Universitaria Base de Misiones Che Guevara",
      "description": "La Aldea Universitaria Base de Misiones Che Guevara...",
      "primaryButtonText": "Ver Publicaciones",
      "secondaryButtonText": "Portal Administrativo"
    },
    "features": {
      "title": "Formación y Comunidad",
      "description": "Nuestra Aldea Universitaria trabaja de la mano...",
      "cards": [
        {
          "id": "1",
          "title": "Servicios / Formación",
          "description": "La Aldea Universitaria ofrece Programas Nacionales...",
          "icon": "BookCopy"
        }
      ]
    },
    "downloads": {
      "title": "Archivos y Enlaces",
      "description": "Accede a documentos importantes y enlaces útiles...",
      "items": [
        {
          "id": "1",
          "title": "Reglamento de Convivencia 2024",
          "description": "Normativas actualizadas para la convivencia...",
          "type": "pdf",
          "url": "/docs/reglamento-2024.pdf",
          "size": "2.5 MB"
        }
      ]
    },
    "info": {
      "title": "Información de la Urbanización",
      "description": "",
      "sections": [
        {
          "id": "1",
          "title": "Ubicación estratégica",
          "description": "Está situada al este de Valle de la Pascua...",
          "icon": "MapPinHouse"
        }
      ]
    },
    "gallery": {
      "title": "Galería de Nuestra Urbanización",
      "description": "La Urbanización Padre Chacín se ubica al este...",
      "images": [
        {
          "id": "1",
          "url": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
          "title": "Entrada Principal",
          "description": "Vista de la entrada principal de la urbanización"
        }
      ]
    },
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 2. Obtener Contenido del Home para Administración (Privado)

### GET `/api/home/admin`

Obtiene el contenido activo para la interfaz de administración.

**Headers requeridos:**

```
Authorization: Bearer <token>
```

**Respuesta:** Igual que la ruta pública.

---

## 3. Crear/Actualizar Contenido del Home (Privado)

### POST `/api/home/admin`

Crea o actualiza el contenido de la página principal. Si ya existe contenido activo, lo desactiva y crea uno nuevo.

**Headers requeridos:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body requerido:**

```json
{
  "hero": {
    "title": "Bienvenidos a",
    "subtitle": "Aldea Universitaria Base de Misiones Che Guevara",
    "description": "La Aldea Universitaria Base de Misiones Che Guevara, ubicada en Valle de la Pascua, garantiza el acceso inclusivo a la educación universitaria, formando profesionales comprometidos con el desarrollo local, enmarcados en una ética socialista y el pensamiento bolivariano.",
    "primaryButtonText": "Ver Publicaciones",
    "secondaryButtonText": "Portal Administrativo"
  },
  "features": {
    "title": "Formación y Comunidad",
    "description": "Nuestra Aldea Universitaria trabaja de la mano con las comunidades del sector Padre Chacín y zonas aledañas, promoviendo la organización popular y el desarrollo social.",
    "cards": [
      {
        "id": "1",
        "title": "Servicios / Formación",
        "description": "La Aldea Universitaria ofrece Programas Nacionales de Formación gratuitos y adaptados a las necesidades del pueblo, con enfoque social y comunitario, formando profesionales comprometidos con el desarrollo local.",
        "icon": "BookCopy"
      },
      {
        "id": "2",
        "title": "Documentos",
        "description": "Consulta y descarga documentos esenciales como reglamentos, planes de estudio, constancias, calendarios académicos y otros recursos necesarios para el desarrollo académico.",
        "icon": "FileText"
      },
      {
        "id": "3",
        "title": "Comunidad",
        "description": "La aldea mantiene una estrecha relación con las comunidades vecinas, promoviendo la participación activa en proyectos sociales, culturales y educativos que fortalecen el desarrollo colectivo.",
        "icon": "Users"
      }
    ]
  },
  "downloads": {
    "title": "Archivos y Enlaces",
    "description": "Accede a documentos importantes y enlaces útiles para residentes",
    "items": [
      {
        "id": "1",
        "title": "Reglamento de Convivencia 2024",
        "description": "Normativas actualizadas para la convivencia en la urbanización",
        "type": "pdf",
        "url": "/docs/reglamento-2024.pdf",
        "size": "2.5 MB"
      },
      {
        "id": "2",
        "title": "Manual del Propietario",
        "description": "Guía completa para nuevos residentes",
        "type": "pdf",
        "url": "/docs/manual-propietario.pdf",
        "size": "1.8 MB"
      },
      {
        "id": "3",
        "title": "Formulario de Solicitudes",
        "description": "Plantilla para solicitudes administrativas",
        "type": "word",
        "url": "/docs/formulario-solicitudes.docx",
        "size": "125 KB"
      },
      {
        "id": "4",
        "title": "Registro de Visitantes",
        "description": "Hoja de cálculo para control de visitas",
        "type": "excel",
        "url": "/docs/registro-visitantes.xlsx",
        "size": "85 KB"
      },
      {
        "id": "5",
        "title": "Portal de Pagos Online",
        "description": "Accede al sistema de pagos de administración",
        "type": "link",
        "url": "https://pagos.urbanizacion.com"
      },
      {
        "id": "6",
        "title": "Directorio de Emergencias",
        "description": "Números importantes y servicios de emergencia",
        "type": "link",
        "url": "https://emergencias.urbanizacion.com"
      }
    ]
  },
  "info": {
    "title": "Información de la Urbanización",
    "description": "",
    "sections": [
      {
        "id": "1",
        "title": "Ubicación estratégica",
        "description": "Está situada al este de Valle de la Pascua, lo que facilita el acceso a la educación para estudiantes de comunidades urbanas y rurales cercanas.",
        "icon": "MapPinHouse"
      },
      {
        "id": "2",
        "title": "Sede educativa",
        "description": "En esta urbanización se encuentra la sede de la Aldea Universitaria Base de Misiones Che Guevara, específicamente en la E.B.N. Williams Lara, lo que la convierte en un punto clave para la formación universitaria local.",
        "icon": "BookText"
      },
      {
        "id": "3",
        "title": "Apoyo a la inclusión",
        "description": "Su cercanía y accesibilidad contribuyen significativamente a la inclusión educativa y al ascenso social de los bachilleres de la zona.",
        "icon": "UsersRound"
      }
    ]
  },
  "gallery": {
    "title": "Galería de Nuestra Urbanización",
    "description": "La Urbanización Padre Chacín se ubica al este de Valle de la Pascua, Estado Guárico. Es una comunidad residencial que cuenta con servicios básicos, espacios deportivos y educativos.",
    "images": [
      {
        "id": "1",
        "url": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
        "title": "Entrada Principal",
        "description": "Vista de la entrada principal de la urbanización"
      },
      {
        "id": "2",
        "url": "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&h=400&fit=crop",
        "title": "Área de Seguridad",
        "description": "Caseta de vigilancia 24/7"
      },
      {
        "id": "3",
        "url": "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=600&h=400&fit=crop",
        "title": "Jardines",
        "description": "Espacios verdes y áreas de recreación"
      },
      {
        "id": "4",
        "url": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop",
        "title": "Áreas Comunes",
        "description": "Salón de eventos y reuniones"
      },
      {
        "id": "5",
        "url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
        "title": "Parque Infantil",
        "description": "Área de juegos para niños"
      },
      {
        "id": "6",
        "url": "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=600&h=400&fit=crop",
        "title": "Piscina Comunitaria",
        "description": "Área de piscina y recreación acuática"
      }
    ]
  }
}
```

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Contenido del Home guardado exitosamente",
  "data": {
    "_id": "65a1b2c3d4e5f6789012345",
    "hero": { ... },
    "features": { ... },
    "downloads": { ... },
    "info": { ... },
    "gallery": { ... },
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Errores de Validación (400):**

```json
{
  "success": false,
  "message": "Error de validación",
  "errors": [
    {
      "field": "hero.title",
      "message": "El título del hero es obligatorio"
    }
  ]
}
```

---

## 4. Obtener Historial del Contenido (Privado)

### GET `/api/home/admin/history`

Obtiene el historial de todas las versiones del contenido del Home con paginación.

**Headers requeridos:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `limit` (opcional): Número de elementos por página (1-50, default: 10)
- `page` (opcional): Número de página (default: 1)

**Ejemplo:**

```
GET /api/home/admin/history?limit=5&page=1
```

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Historial del contenido obtenido exitosamente",
  "data": {
    "content": [
      {
        "_id": "65a1b2c3d4e5f6789012345",
        "hero": { ... },
        "features": { ... },
        "downloads": { ... },
        "info": { ... },
        "gallery": { ... },
        "isActive": true,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 15,
      "page": 1,
      "limit": 5,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

## 5. Restaurar Versión Anterior (Privado)

### POST `/api/home/admin/restore/:contentId`

Restaura una versión anterior del contenido como la versión activa.

**Headers requeridos:**

```
Authorization: Bearer <token>
```

**Parámetros de URL:**

- `contentId`: ID de la versión a restaurar

**Ejemplo:**

```
POST /api/home/admin/restore/65a1b2c3d4e5f6789012345
```

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Contenido restaurado exitosamente",
  "data": {
    "_id": "65a1b2c3d4e5f6789012345",
    "hero": { ... },
    "features": { ... },
    "downloads": { ... },
    "info": { ... },
    "gallery": { ... },
    "isActive": true,
    "createdAt": "2024-01-10T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error (404):**

```json
{
  "success": false,
  "message": "Error al restaurar el contenido",
  "error": "Contenido no encontrado"
}
```

---

## 6. Eliminar Versión del Contenido (Privado)

### DELETE `/api/home/admin/:contentId`

Elimina una versión específica del contenido (no puede ser la versión activa).

**Headers requeridos:**

```
Authorization: Bearer <token>
```

**Parámetros de URL:**

- `contentId`: ID de la versión a eliminar

**Ejemplo:**

```
DELETE /api/home/admin/65a1b2c3d4e5f6789012345
```

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Contenido eliminado exitosamente"
}
```

**Error (400):**

```json
{
  "success": false,
  "message": "Error al eliminar el contenido",
  "error": "No se puede eliminar el contenido activo"
}
```

---

## 7. Obtener Estadísticas (Privado)

### GET `/api/home/admin/stats`

Obtiene estadísticas sobre el contenido del Home.

**Headers requeridos:**

```
Authorization: Bearer <token>
```

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Estadísticas obtenidas exitosamente",
  "data": {
    "totalVersions": 15,
    "hasActiveContent": true,
    "lastUpdate": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## Tipos de Datos

### Hero Section

```typescript
{
  title: string; // 1-200 caracteres
  subtitle: string; // 1-200 caracteres
  description: string; // 10-1000 caracteres
  primaryButtonText: string; // 1-50 caracteres
  secondaryButtonText: string; // 1-50 caracteres
}
```

### Features Section

```typescript
{
  title: string; // 1-200 caracteres
  description: string; // 10-1000 caracteres
  cards: Array<{
    id: string; // Requerido
    title: string; // 1-100 caracteres
    description: string; // 10-500 caracteres
    icon: string; // 1-50 caracteres
  }>;
}
```

### Downloads Section

```typescript
{
  title: string; // 1-200 caracteres
  description: string; // 10-1000 caracteres
  items: Array<{
    id: string; // Requerido
    title: string; // 1-100 caracteres
    description: string; // 10-300 caracteres
    type: "pdf" | "word" | "excel" | "link";
    url: string; // 1-500 caracteres
    size?: string; // Máximo 20 caracteres (opcional)
  }>;
}
```

### Info Section

```typescript
{
  title: string;           // 1-200 caracteres
  description?: string;    // Máximo 1000 caracteres (opcional)
  sections: Array<{
    id: string;            // Requerido
    title: string;         // 1-100 caracteres
    description: string;   // 10-500 caracteres
    icon: string;          // 1-50 caracteres
  }>;
}
```

### Gallery Section

```typescript
{
  title: string; // 1-200 caracteres
  description: string; // 10-1000 caracteres
  images: Array<{
    id: string; // Requerido
    url: string; // 1-500 caracteres
    title: string; // 1-100 caracteres
    description: string; // 10-300 caracteres
  }>;
}
```

---

## Códigos de Error Comunes

- **400**: Error de validación o datos inválidos
- **401**: No autorizado (token inválido o faltante)
- **404**: Recurso no encontrado
- **500**: Error interno del servidor

---

## Notas Importantes

1. **Versionado**: Cada vez que se actualiza el contenido, se crea una nueva versión y se desactiva la anterior.
2. **Contenido Activo**: Solo puede haber una versión activa a la vez.
3. **Eliminación**: No se puede eliminar la versión activa del contenido.
4. **Contenido por Defecto**: Si no existe contenido activo, se retorna contenido por defecto.
5. **Validación**: Todas las rutas privadas incluyen validación de esquemas.
6. **Paginación**: El historial incluye paginación para manejar grandes volúmenes de datos.
