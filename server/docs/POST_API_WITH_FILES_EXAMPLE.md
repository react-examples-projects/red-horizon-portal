# API de Posts con Archivos - Documentación Actualizada

## Descripción

Esta documentación describe cómo crear posts con archivos (imágenes y documentos) usando la nueva estructura de datos que incluye información completa de los archivos.

## Estructura de Archivos

### Imágenes

Cada imagen ahora incluye información completa:

```json
{
  "url": "https://res.cloudinary.com/...",
  "filename": "mi-imagen.jpg",
  "size": 1024000,
  "mimeType": "image/jpeg",
  "publicId": "red-horizon-portal/posts/images/abc123",
  "format": "jpg",
  "width": 1920,
  "height": 1080,
  "bytes": 1024000,
  "secureUrl": "https://res.cloudinary.com/..."
}
```

### Documentos

Cada documento incluye información completa:

```json
{
  "url": "https://res.cloudinary.com/...",
  "filename": "documento.pdf",
  "size": 2048000,
  "mimeType": "application/pdf",
  "publicId": "red-horizon-portal/posts/documents/def456",
  "format": "pdf",
  "bytes": 2048000,
  "secureUrl": "https://res.cloudinary.com/..."
}
```

## Endpoint para Crear Post con Archivos

### POST `/api/posts`

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (form-data):**

- `title` (string, **requerido**): Título de la publicación
- `category` (string, **requerido**): Categoría
- `description` (string, **requerido**): Descripción
- `images` (file, **opcional**): Imágenes (máximo 10)
- `documents` (file, **opcional**): Documentos (máximo 5)

**Ejemplo de Request:**

```bash
curl -X POST /api/posts \
  -H "Authorization: Bearer <token>" \
  -F "title=Mi publicación con archivos" \
  -F "category=tecnologia" \
  -F "description=Esta es una descripción detallada..." \
  -F "images=@imagen1.jpg" \
  -F "images=@imagen2.png" \
  -F "documents=@documento.pdf"
```

**Respuesta Exitosa (201):**

```json
{
  "ok": true,
  "error": false,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "title": "Mi publicación con archivos",
    "category": "tecnologia",
    "description": "Esta es una descripción detallada...",
    "images": [
      {
        "url": "https://res.cloudinary.com/...",
        "filename": "imagen1.jpg",
        "size": 1024000,
        "mimeType": "image/jpeg",
        "publicId": "red-horizon-portal/posts/images/abc123",
        "format": "jpg",
        "width": 1920,
        "height": 1080,
        "bytes": 1024000,
        "secureUrl": "https://res.cloudinary.com/..."
      },
      {
        "url": "https://res.cloudinary.com/...",
        "filename": "imagen2.png",
        "size": 512000,
        "mimeType": "image/png",
        "publicId": "red-horizon-portal/posts/images/def456",
        "format": "png",
        "width": 800,
        "height": 600,
        "bytes": 512000,
        "secureUrl": "https://res.cloudinary.com/..."
      }
    ],
    "documents": [
      {
        "url": "https://res.cloudinary.com/...",
        "filename": "documento.pdf",
        "size": 2048000,
        "mimeType": "application/pdf",
        "publicId": "red-horizon-portal/posts/documents/ghi789",
        "format": "pdf",
        "bytes": 2048000,
        "secureUrl": "https://res.cloudinary.com/..."
      }
    ],
    "author": "64f8a1b2c3d4e5f6a7b8c9d1",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "statusCode": 201
}
```

## Endpoint para Actualizar Post con Archivos

### PATCH `/api/posts/:id`

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (form-data):**

- `title` (string, **opcional**): Nuevo título de la publicación
- `category` (string, **opcional**): Nueva categoría
- `description` (string, **opcional**): Nueva descripción
- `imagesToDelete` (string JSON o array, **opcional**): IDs de MongoDB de imágenes a eliminar (puede ser JSON string o array)
- `documentsToDelete` (string JSON o array, **opcional**): IDs de MongoDB de documentos a eliminar (puede ser JSON string o array)
- `images` (file, **opcional**): Nuevas imágenes para agregar
- `documents` (file, **opcional**): Nuevos documentos para agregar

**Ejemplo de Request:**

```bash
curl -X PATCH /api/posts/64f8a1b2c3d4e5f6a7b8c9d0 \
  -H "Authorization: Bearer <token>" \
  -F "title=Título actualizado" \
  -F "description=Descripción actualizada" \
  -F "imagesToDelete=[\"686317512ffbf7dd54c5bd96\",\"686317512ffbf7dd54c5bd97\"]" \
  -F "documentsToDelete=[\"686317512ffbf7dd54c5bd99\"]" \
  -F "images=@nueva-imagen.jpg" \
  -F "documents=@nuevo-documento.pdf"
```

**Ejemplo con JavaScript (FormData):**

```javascript
const formData = new FormData();
formData.append("title", "Título actualizado");
formData.append("description", "Descripción actualizada");

// Opción 1: Como JSON string
formData.append(
  "imagesToDelete",
  JSON.stringify(["686317512ffbf7dd54c5bd96", "686317512ffbf7dd54c5bd97"])
);
formData.append("documentsToDelete", JSON.stringify(["686317512ffbf7dd54c5bd99"]));

// Opción 2: Como múltiples campos (el servidor los procesará como array)
formData.append("imagesToDelete", "686317512ffbf7dd54c5bd96");
formData.append("imagesToDelete", "686317512ffbf7dd54c5bd97");
formData.append("documentsToDelete", "686317512ffbf7dd54c5bd99");

// Agregar nuevos archivos
formData.append("images", newImageFile);
formData.append("documents", newDocumentFile);

const response = await fetch(`/api/posts/${postId}`, {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});
```

**Ejemplo con JavaScript (JSON):**

```javascript
// Si envías como JSON en lugar de FormData
const updateData = {
  title: "Título actualizado",
  description: "Descripción actualizada",
  imagesToDelete: ["686317512ffbf7dd54c5bd96", "686317512ffbf7dd54c5bd97"],
  documentsToDelete: ["686317512ffbf7dd54c5bd99"],
};

const response = await fetch(`/api/posts/${postId}`, {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(updateData),
});
```

**Respuesta Exitosa (200):**

```json
{
  "ok": true,
  "error": false,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "title": "Título actualizado",
    "category": "tecnologia",
    "description": "Descripción actualizada",
    "images": [
      {
        "_id": "686317512ffbf7dd54c5bd98",
        "url": "https://res.cloudinary.com/...",
        "filename": "imagen-mantener.jpg",
        "size": 1024000,
        "mimeType": "image/jpeg",
        "publicId": "red-horizon-portal/posts/images/abc123",
        "format": "jpg",
        "width": 1920,
        "height": 1080,
        "bytes": 1024000,
        "secureUrl": "https://res.cloudinary.com/..."
      },
      {
        "_id": "686317512ffbf7dd54c5bd9a",
        "url": "https://res.cloudinary.com/...",
        "filename": "nueva-imagen.jpg",
        "size": 512000,
        "mimeType": "image/jpeg",
        "publicId": "red-horizon-portal/posts/images/def456",
        "format": "jpg",
        "width": 800,
        "height": 600,
        "bytes": 512000,
        "secureUrl": "https://res.cloudinary.com/..."
      }
    ],
    "documents": [
      {
        "_id": "686317512ffbf7dd54c5bd9b",
        "url": "https://res.cloudinary.com/...",
        "filename": "nuevo-documento.pdf",
        "size": 2048000,
        "mimeType": "application/pdf",
        "publicId": "red-horizon-portal/posts/documents/ghi789",
        "format": "pdf",
        "bytes": 2048000,
        "secureUrl": "https://res.cloudinary.com/..."
      }
    ],
    "author": "64f8a1b2c3d4e5f6a7b8c9d1",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:45:00.000Z"
  },
  "statusCode": 200
}
```

## Campos de Archivos

### Campos Comunes

- **url**: URL del archivo en Cloudinary
- **filename**: Nombre original del archivo
- **size**: Tamaño del archivo en bytes
- **mimeType**: Tipo MIME del archivo
- **publicId**: Identificador único en Cloudinary
- **format**: Formato del archivo (jpg, png, pdf, etc.)
- **bytes**: Tamaño en bytes (igual que size)
- **secureUrl**: URL segura HTTPS del archivo

### Campos Específicos de Imágenes

- **width**: Ancho de la imagen en píxeles
- **height**: Alto de la imagen en píxeles

## Uso en Frontend

### React/TypeScript

```typescript
interface FileInfo {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  publicId: string;
  format: string;
  width?: number;
  height?: number;
  bytes: number;
  secureUrl: string;
}

interface Post {
  _id: string;
  title: string;
  category: string;
  description: string;
  images: FileInfo[];
  documents: FileInfo[];
  author: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Ejemplo de uso
{
  publication.images && publication.images.length > 0 && (
    <div>
      <h3>Imágenes ({publication.images.length})</h3>
      {publication.images.map((image, index) => (
        <div key={index}>
          <img src={image.url} alt={image.filename} />
          <p>Nombre: {image.filename}</p>
          <p>Tamaño: {formatFileSize(image.size)}</p>
          <p>Formato: {image.format}</p>
          <p>
            Dimensiones: {image.width}x{image.height}
          </p>
        </div>
      ))}
    </div>
  );
}

{
  publication.documents && publication.documents.length > 0 && (
    <div>
      <h3>Documentos ({publication.documents.length})</h3>
      {publication.documents.map((document, index) => (
        <div key={index}>
          <p>Nombre: {document.filename}</p>
          <p>Tamaño: {formatFileSize(document.size)}</p>
          <p>Tipo: {document.mimeType}</p>
          <a href={document.url} download={document.filename}>
            Descargar
          </a>
        </div>
      ))}
    </div>
  );
}
```

### Función para Formatear Tamaño de Archivo

```typescript
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
```

## Notas Importantes

1. **Compatibilidad**: Los posts existentes seguirán funcionando, pero las imágenes y documentos se mostrarán como strings (URLs) hasta que se actualicen.

2. **Migración**: Para migrar posts existentes, se puede crear un script que actualice la estructura de archivos.

3. **Validación**: El modelo valida que no se excedan los límites (10 imágenes, 5 documentos).

4. **Eliminación**: Al eliminar un post, se eliminan automáticamente todos los archivos asociados de Cloudinary.

5. **Seguridad**: Todas las URLs usan HTTPS y son seguras para el frontend.

## Migración de Posts Antiguos

### Script de Migración (Opcional)

Si tienes posts antiguos con URLs como strings, puedes migrarlos a la nueva estructura:

```javascript
// Script de migración para posts antiguos
async function migrateOldPosts() {
  const Post = require("./models/Post");

  // Buscar posts con imágenes o documentos como strings
  const oldPosts = await Post.find({
    $or: [
      { images: { $elemMatch: { $type: "string" } } },
      { documents: { $elemMatch: { $type: "string" } } },
    ],
  });

  for (const post of oldPosts) {
    const updates = {};

    // Migrar imágenes
    if (post.images && post.images.some((img) => typeof img === "string")) {
      updates.images = post.images.map((img) => {
        if (typeof img === "string") {
          // Extraer información de la URL
          const publicId = extractPublicIdFromUrl(img);
          const format = img.split(".").pop() || "jpg";

          return {
            url: img,
            filename: `migrated_image_${Date.now()}.${format}`,
            size: 0, // No disponible en URLs antiguas
            mimeType: `image/${format}`,
            publicId: publicId || "unknown",
            format: format,
            bytes: 0,
            secureUrl: img,
          };
        }
        return img; // Ya es un objeto
      });
    }

    // Migrar documentos
    if (post.documents && post.documents.some((doc) => typeof doc === "string")) {
      updates.documents = post.documents.map((doc) => {
        if (typeof doc === "string") {
          // Extraer información de la URL
          const publicId = extractPublicIdFromUrl(doc);
          const format = doc.split(".").pop() || "pdf";

          return {
            url: doc,
            filename: `migrated_document_${Date.now()}.${format}`,
            size: 0, // No disponible en URLs antiguas
            mimeType: `application/${format}`,
            publicId: publicId || "unknown",
            format: format,
            bytes: 0,
            secureUrl: doc,
          };
        }
        return doc; // Ya es un objeto
      });
    }

    // Actualizar el post
    if (Object.keys(updates).length > 0) {
      await Post.findByIdAndUpdate(post._id, updates);
      console.log(`Post ${post._id} migrado`);
    }
  }

  console.log("Migración completada");
}
```

### Compatibilidad en Frontend

El frontend debe manejar ambas estructuras:

```typescript
// Función helper para obtener URL de imagen
function getImageUrl(image: string | FileInfo): string {
  if (typeof image === "string") {
    return image; // Post antiguo
  }
  return image.url || image.secureUrl; // Post nuevo
}

// Función helper para obtener nombre de archivo
function getFileName(file: string | FileInfo): string {
  if (typeof file === "string") {
    return "Archivo"; // Post antiguo
  }
  return file.filename || "Archivo sin nombre";
}

// Función helper para obtener tamaño
function getFileSize(file: string | FileInfo): number {
  if (typeof file === "string") {
    return 0; // No disponible en posts antiguos
  }
  return file.size || 0;
}
```

## Errores Comunes

### Error de Validación

```json
{
  "ok": false,
  "error": {
    "name": "ValidationError",
    "data": {
      "images": "No se pueden subir más de 10 imágenes"
    }
  }
}
```

### Error de Archivo

```json
{
  "ok": false,
  "error": {
    "name": "Error",
    "data": "Error al subir imágenes: Invalid file type"
  }
}
```

## Funcionalidades de Actualización

### 1. Eliminar Archivos Específicos

- **imagesToDelete**: Array de IDs de MongoDB de imágenes a eliminar
- **documentsToDelete**: Array de IDs de MongoDB de documentos a eliminar
- Los archivos se eliminan tanto de la base de datos como de Cloudinary
- Solo el autor del post puede eliminar archivos

### 2. Agregar Nuevos Archivos

- **images**: Nuevas imágenes para agregar al post
- **documents**: Nuevos documentos para agregar al post
- Se respetan los límites (máximo 10 imágenes, 5 documentos)
- Los archivos se suben a Cloudinary y se guardan con información completa

### 3. Mantener Archivos Existentes

- Los archivos que no estén en los arrays de eliminación se mantienen
- Se combinan con los nuevos archivos agregados

### 4. Actualizar Información del Post

- **title**: Actualizar título (opcional)
- **category**: Actualizar categoría (opcional)
- **description**: Actualizar descripción (opcional)

## Ejemplos de Uso

### Solo Eliminar Archivos

```javascript
const formData = new FormData();
formData.append("imagesToDelete", "686317512ffbf7dd54c5bd96");
formData.append("documentsToDelete", "686317512ffbf7dd54c5bd99");
```

### Solo Agregar Archivos

```javascript
const formData = new FormData();
formData.append("images", imageFile1);
formData.append("images", imageFile2);
formData.append("documents", documentFile);
```

### Eliminar y Agregar

```javascript
const formData = new FormData();
formData.append("title", "Nuevo título");
formData.append("imagesToDelete", "686317512ffbf7dd54c5bd96");
formData.append("images", newImageFile);
```

### Solo Actualizar Texto

```javascript
const formData = new FormData();
formData.append("title", "Título actualizado");
formData.append("description", "Nueva descripción");
```

## Validaciones

### Campos de Eliminación

- **imagesToDelete**: Array de strings con formato ObjectId válido
- **documentsToDelete**: Array de strings con formato ObjectId válido
- Los IDs deben corresponder a archivos existentes en el post

### Límites de Archivos

- **Máximo 10 imágenes** en total (existentes + nuevas)
- **Máximo 5 documentos** en total (existentes + nuevos)
- Si se excede el límite, se devuelve error de validación

### Permisos

- Solo el autor del post puede actualizarlo
- Se verifica la propiedad antes de permitir cambios

## Manejo de Errores

### Error de Permisos (403)

```json
{
  "ok": false,
  "error": {
    "name": "Error",
    "data": "No tienes permisos para editar esta publicación"
  }
}
```

### Error de Validación (400)

```json
{
  "ok": false,
  "error": {
    "name": "ValidationError",
    "data": {
      "imagesToDelete": "ID de imagen inválido"
    }
  }
}
```

### Error de Límite de Archivos (400)

```json
{
  "ok": false,
  "error": {
    "name": "ValidationError",
    "data": {
      "images": "No se pueden subir más de 10 imágenes"
    }
  }
}
```

## Notas Importantes

1. **Operación Atómica**: La actualización es atómica - si falla la subida de nuevos archivos, no se eliminan los archivos existentes
2. **Eliminación de Cloudinary**: Los archivos eliminados se borran automáticamente de Cloudinary
3. **Logs**: Se registran en consola las operaciones de eliminación de archivos
4. **Compatibilidad**: Funciona con posts antiguos (URLs) y nuevos (objetos completos)
5. **Performance**: Las operaciones de eliminación y subida se ejecutan en paralelo cuando es posible
