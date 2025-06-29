# Documentación de Subida de Archivos con Cloudinary

## Configuración

### Variables de Entorno Requeridas

Asegúrate de tener las siguientes variables de entorno configuradas en tu archivo `.env`:

```env
CLOUDINARY_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### Dependencias Instaladas

```bash
npm install cloudinary streamifier
```

## Funciones Disponibles

### 1. Subir Imagen Individual

```javascript
const { uploadImage } = require("../helpers/cloudinary");

// Subir una imagen
const imageBuffer = file.data; // Buffer de la imagen
const result = await uploadImage(imageBuffer);

// Resultado incluye:
// {
//   secure_url: "https://res.cloudinary.com/...",
//   public_id: "red-horizon-portal/posts/images/...",
//   format: "jpg",
//   width: 1920,
//   height: 1080,
//   bytes: 123456
// }
```

### 2. Subir Múltiples Imágenes

```javascript
const { uploadMultipleImages } = require("../helpers/cloudinary");

// Subir múltiples imágenes
const imageBuffers = files.map((file) => file.data);
const results = await uploadMultipleImages(imageBuffers);

// results es un array con los resultados de cada imagen
```

### 3. Subir Documento Individual

```javascript
const { uploadDocument } = require("../helpers/cloudinary");

// Subir un documento
const documentBuffer = file.data; // Buffer del documento
const result = await uploadDocument(documentBuffer);

// Resultado incluye:
// {
//   secure_url: "https://res.cloudinary.com/...",
//   public_id: "red-horizon-portal/posts/documents/...",
//   format: "pdf",
//   bytes: 123456
// }
```

### 4. Subir Múltiples Documentos

```javascript
const { uploadMultipleDocuments } = require("../helpers/cloudinary");

// Subir múltiples documentos
const documentBuffers = files.map((file) => file.data);
const results = await uploadMultipleDocuments(documentBuffers);
```

### 5. Subir Video

```javascript
const { uploadVideo } = require("../helpers/cloudinary");

// Subir un video
const videoBuffer = file.data; // Buffer del video
const result = await uploadVideo(videoBuffer);
```

## Opciones de Configuración

Todas las funciones aceptan un objeto de opciones como segundo parámetro:

```javascript
const options = {
  folder: "custom-folder", // Carpeta personalizada
  public_id: "custom-name", // ID público personalizado
  transformation: {
    // Transformaciones de Cloudinary
    width: 800,
    height: 600,
    crop: "fill",
  },
};

const result = await uploadImage(imageBuffer, options);
```

## Estructura de Carpetas en Cloudinary

- **Imágenes**: `red-horizon-portal/posts/images/`
- **Documentos**: `red-horizon-portal/posts/documents/`
- **Videos**: `red-horizon-portal/posts/videos/`

## Uso en el Controlador de Posts

El controlador ya está configurado para usar estas funciones:

```javascript
// En createPost del controlador
if (req.files && req.files.images) {
  const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

  const imageBuffers = imageFiles.map((file) => file.data);
  const uploadedImages = await uploadMultipleImages(imageBuffers);

  // Guardar URLs seguras en el modelo
  postData.images = uploadedImages.map((img) => img.secure_url);
}
```

## Manejo de Errores

Las funciones incluyen manejo de errores:

```javascript
try {
  const result = await uploadImage(imageBuffer);
  // Procesar resultado
} catch (error) {
  console.error("Error al subir imagen:", error.message);
  // Manejar el error apropiadamente
}
```

## Ventajas de Cloudinary

1. **URLs Seguras**: Todas las URLs generadas usan HTTPS
2. **Optimización Automática**: Cloudinary optimiza automáticamente las imágenes
3. **Transformaciones**: Posibilidad de aplicar transformaciones en tiempo real
4. **CDN Global**: Distribución global de contenido
5. **Backup Automático**: Respaldo automático de archivos
6. **Escalabilidad**: Manejo de tráfico alto sin problemas

## Ejemplo de Respuesta Completa

```javascript
{
  "ok": true,
  "error": false,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "title": "Mi Post",
    "category": "Tecnología",
    "description": "Descripción del post",
    "images": [
      "https://res.cloudinary.com/tu-cloud/image/upload/v1234567890/red-horizon-portal/posts/images/imagen1.jpg",
      "https://res.cloudinary.com/tu-cloud/image/upload/v1234567890/red-horizon-portal/posts/images/imagen2.jpg"
    ],
    "documents": [
      "https://res.cloudinary.com/tu-cloud/raw/upload/v1234567890/red-horizon-portal/posts/documents/documento1.pdf"
    ],
    "author": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "Usuario",
      "email": "usuario@ejemplo.com"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "statusCode": 201
}
```
