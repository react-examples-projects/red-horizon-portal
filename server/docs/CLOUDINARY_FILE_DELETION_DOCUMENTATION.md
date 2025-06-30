# Eliminación de Archivos de Cloudinary - Documentación

## Descripción

Esta funcionalidad permite eliminar automáticamente todas las imágenes y documentos asociados a un post cuando este es eliminado, liberando espacio en Cloudinary y manteniendo la limpieza del almacenamiento.

## Funcionalidades Implementadas

### 1. Eliminación Automática de Archivos

Cuando se elimina un post (soft delete), el sistema automáticamente:

1. **Extrae las URLs** de imágenes y documentos del post
2. **Convierte las URLs** a public_ids de Cloudinary
3. **Elimina los archivos** de Cloudinary usando la API
4. **Registra los resultados** de la eliminación
5. **Continúa con la eliminación** del post incluso si falla la eliminación de archivos

### 2. Manejo de Errores Robusto

- Si falla la eliminación de archivos, el post se elimina de todas formas
- Se registran errores específicos para cada archivo
- Se proporciona información detallada sobre éxitos y fallos

## Funciones Disponibles

### `deleteFile(publicId, resourceType)`

Elimina un archivo individual de Cloudinary.

```javascript
const { deleteFile } = require("../helpers/cloudinary");

// Eliminar una imagen
const result = await deleteFile("red-horizon-portal/posts/images/imagen1", "image");

// Eliminar un documento
const result = await deleteFile("red-horizon-portal/posts/documents/doc1", "raw");
```

### `extractPublicIdFromUrl(url)`

Extrae el public_id de una URL de Cloudinary.

```javascript
const { extractPublicIdFromUrl } = require("../helpers/cloudinary");

const url =
  "https://res.cloudinary.com/tu-cloud/image/upload/v1234567890/red-horizon-portal/posts/images/imagen1.jpg";
const publicId = extractPublicIdFromUrl(url);
// Resultado: "red-horizon-portal/posts/images/imagen1"
```

### `deleteMultipleFiles(urls, resourceType)`

Elimina múltiples archivos de Cloudinary.

```javascript
const { deleteMultipleFiles } = require("../helpers/cloudinary");

const imageUrls = [
  "https://res.cloudinary.com/tu-cloud/image/upload/v1234567890/red-horizon-portal/posts/images/imagen1.jpg",
  "https://res.cloudinary.com/tu-cloud/image/upload/v1234567890/red-horizon-portal/posts/images/imagen2.png",
];

const results = await deleteMultipleFiles(imageUrls, "image");
```

### `deletePostFiles(post)`

Elimina todas las imágenes y documentos de un post.

```javascript
const { deletePostFiles } = require("../helpers/cloudinary");

const post = {
  images: ["https://res.cloudinary.com/...", "https://res.cloudinary.com/..."],
  documents: ["https://res.cloudinary.com/..."],
};

const results = await deletePostFiles(post);
```

## Uso en la API

### Endpoint de Eliminación

```
DELETE /api/posts/:id
```

### Respuesta de Eliminación

```json
{
  "ok": true,
  "error": false,
  "data": {
    "post": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "title": "Post Eliminado",
      "isActive": false,
      "author": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "name": "Usuario",
        "email": "usuario@ejemplo.com"
      }
    },
    "cloudinaryCleanup": {
      "images": {
        "deleted": 2,
        "failed": 0,
        "errors": []
      },
      "documents": {
        "deleted": 1,
        "failed": 0,
        "errors": []
      }
    },
    "message": "Publicación eliminada exitosamente. Se eliminaron 3 archivo(s) de Cloudinary"
  },
  "statusCode": 200
}
```

### Ejemplo con Errores

```json
{
  "ok": true,
  "error": false,
  "data": {
    "post": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "title": "Post Eliminado",
      "isActive": false
    },
    "cloudinaryCleanup": {
      "images": {
        "deleted": 1,
        "failed": 1,
        "errors": ["Imagen 2: Resource not found"]
      },
      "documents": {
        "deleted": 0,
        "failed": 1,
        "errors": ["Documento 1: Invalid public_id"]
      }
    },
    "message": "Publicación eliminada exitosamente. Se eliminaron 1 archivo(s) de Cloudinary. No se pudieron eliminar 2 archivo(s)"
  },
  "statusCode": 200
}
```

## Patrones de URL Soportados

La función `extractPublicIdFromUrl` puede manejar varios formatos de URL de Cloudinary:

### URLs Básicas

```
https://res.cloudinary.com/cloud-name/image/upload/v1234567890/folder/file.jpg
```

### URLs con Transformaciones

```
https://res.cloudinary.com/cloud-name/image/upload/c_fill,w_300,h_200/v1234567890/folder/file.jpg
```

### URLs de Documentos (Raw)

```
https://res.cloudinary.com/cloud-name/raw/upload/v1234567890/folder/document.pdf
```

### URLs con Caracteres Especiales

```
https://res.cloudinary.com/cloud-name/image/upload/v1234567890/folder/file%20with%20spaces.jpg
```

## Manejo de Errores

### Errores Comunes

1. **Resource not found**: El archivo ya no existe en Cloudinary
2. **Invalid public_id**: El public_id extraído no es válido
3. **Network error**: Error de conexión con Cloudinary
4. **Authentication error**: Problemas con las credenciales de Cloudinary

### Estrategia de Fallback

Si la eliminación de archivos falla:

1. **Se registra el error** en la consola
2. **Se continúa** con la eliminación del post
3. **Se incluye información** sobre los errores en la respuesta
4. **No se bloquea** la operación principal

## Logs y Monitoreo

### Logs de Éxito

```
Archivos eliminados de Cloudinary: {
  images: { deleted: 2, failed: 0, errors: [] },
  documents: { deleted: 1, failed: 0, errors: [] }
}
```

### Logs de Error

```
Error al eliminar archivos de Cloudinary: Error: Network timeout
```

### Logs de Advertencia

```
No se pudo extraer public_id de la URL: https://invalid-url.com/image.jpg
```

## Configuración Requerida

### Variables de Entorno

```env
CLOUDINARY_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### Permisos de Cloudinary

- **API Key**: Debe tener permisos de eliminación
- **Account Settings**: Verificar que la eliminación esté habilitada

## Ventajas

### ✅ **Limpieza Automática**

- No se acumulan archivos huérfanos en Cloudinary
- Libera espacio de almacenamiento automáticamente
- Mantiene la organización del contenido

### ✅ **Manejo Robusto**

- No falla si hay problemas con Cloudinary
- Proporciona información detallada de errores
- Continúa con la operación principal

### ✅ **Flexibilidad**

- Soporta múltiples tipos de archivos
- Maneja URLs con caracteres especiales
- Compatible con diferentes formatos de URL

### ✅ **Transparencia**

- Informa exactamente qué archivos se eliminaron
- Registra errores específicos
- Proporciona mensajes informativos

## Consideraciones

### **Rendimiento**

- La eliminación de archivos puede tomar tiempo
- Se ejecuta en paralelo para múltiples archivos
- No bloquea la respuesta de la API

### **Seguridad**

- Solo el autor del post puede eliminar archivos
- Se valida la propiedad antes de eliminar
- Se usan credenciales seguras de Cloudinary

### **Mantenimiento**

- Los logs ayudan a identificar problemas
- Se puede monitorear el éxito de las eliminaciones
- Permite debugging de errores específicos

## Ejemplo de Uso Completo

```javascript
// En el frontend
async function deletePost(postId) {
  try {
    const response = await fetch(`/api/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (result.ok) {
      console.log("Post eliminado:", result.data.message);

      // Mostrar información sobre la limpieza de archivos
      if (result.data.cloudinaryCleanup) {
        const { images, documents } = result.data.cloudinaryCleanup;
        console.log(
          `Archivos eliminados: ${images.deleted + documents.deleted} imágenes, ${
            documents.deleted
          } documentos`
        );

        if (images.failed > 0 || documents.failed > 0) {
          console.warn("Algunos archivos no se pudieron eliminar");
        }
      }
    }
  } catch (error) {
    console.error("Error al eliminar post:", error);
  }
}
```

Esta funcionalidad asegura que el almacenamiento en Cloudinary se mantenga limpio y organizado, eliminando automáticamente los archivos asociados cuando se eliminan los posts correspondientes.
