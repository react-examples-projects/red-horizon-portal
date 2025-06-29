# Ejemplo de Uso de la API de Posts con Archivos (Cloudinary)

## Configuración Requerida

### Variables de Entorno

```env
CLOUDINARY_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### Dependencias

```bash
npm install cloudinary streamifier
```

## Crear Post con Imágenes y Documentos

### Endpoint

```
POST /api/posts
```

### Headers

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

### Body (FormData)

```javascript
// Campos de texto
title: "Mi Post con Archivos";
category: "Tecnología";
description: "Este es un post que incluye imágenes y documentos";

// Archivos (opcionales)
images: [File1, File2, File3]; // Máximo 10 imágenes
documents: [File1, File2]; // Máximo 5 documentos
```

### Ejemplo con JavaScript (Frontend)

```javascript
// Función para crear post con archivos
async function createPostWithFiles(postData, imageFiles = [], documentFiles = []) {
  const formData = new FormData();

  // Agregar campos de texto
  formData.append("title", postData.title);
  formData.append("category", postData.category);
  formData.append("description", postData.description);

  // Agregar imágenes (opcional)
  if (imageFiles.length > 0) {
    imageFiles.forEach((file) => {
      formData.append("images", file);
    });
  }

  // Agregar documentos (opcional)
  if (documentFiles.length > 0) {
    documentFiles.forEach((file) => {
      formData.append("documents", file);
    });
  }

  try {
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Token de autenticación
      },
      body: formData,
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error al crear post:", error);
    throw error;
  }
}

// Ejemplo de uso
const postData = {
  title: "Mi Post con Archivos",
  category: "Tecnología",
  description: "Este es un post que incluye imágenes y documentos subidos a Cloudinary",
};

// Archivos seleccionados por el usuario
const imageFiles = [
  /* archivos de imagen */
];
const documentFiles = [
  /* archivos de documento */
];

createPostWithFiles(postData, imageFiles, documentFiles)
  .then((result) => {
    console.log("Post creado:", result);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

### Ejemplo con React

```jsx
import React, { useState } from "react";

function CreatePostForm() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("description", formData.description);

      // Agregar imágenes
      imageFiles.forEach((file) => {
        formDataToSend.append("images", file);
      });

      // Agregar documentos
      documentFiles.forEach((file) => {
        formDataToSend.append("documents", file);
      });

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.ok) {
        alert("Post creado exitosamente");
        // Limpiar formulario
        setFormData({ title: "", category: "", description: "" });
        setImageFiles([]);
        setDocumentFiles([]);
      } else {
        alert("Error al crear post");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al crear post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
  };

  const handleDocumentChange = (e) => {
    const files = Array.from(e.target.files);
    setDocumentFiles(files);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Título:</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Categoría:</label>
        <input
          type="text"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Descripción:</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Imágenes (máximo 10):</label>
        <input type="file" multiple accept="image/*" onChange={handleImageChange} />
        <small>Formatos: JPG, PNG, GIF, WebP. Máximo 5MB cada una.</small>
      </div>

      <div>
        <label>Documentos (máximo 5):</label>
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.rtf"
          onChange={handleDocumentChange}
        />
        <small>Formatos: PDF, DOC, DOCX, TXT, RTF. Máximo 10MB cada uno.</small>
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Creando..." : "Crear Post"}
      </button>
    </form>
  );
}

export default CreatePostForm;
```

### Ejemplo con cURL

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Mi Post con Archivos" \
  -F "category=Tecnología" \
  -F "description=Este es un post que incluye imágenes y documentos" \
  -F "images=@imagen1.jpg" \
  -F "images=@imagen2.png" \
  -F "documents=@documento1.pdf"
```

## Respuesta de la API

### Respuesta Exitosa (201 Created)

```json
{
  "ok": true,
  "error": false,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "title": "Mi Post con Archivos",
    "category": "Tecnología",
    "description": "Este es un post que incluye imágenes y documentos",
    "images": [
      "https://res.cloudinary.com/tu-cloud/image/upload/v1234567890/red-horizon-portal/posts/images/imagen1.jpg",
      "https://res.cloudinary.com/tu-cloud/image/upload/v1234567890/red-horizon-portal/posts/images/imagen2.png"
    ],
    "documents": [
      "https://res.cloudinary.com/tu-cloud/raw/upload/v1234567890/red-horizon-portal/posts/documents/documento1.pdf"
    ],
    "author": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "Usuario",
      "email": "usuario@ejemplo.com",
      "perfil_photo": "https://res.cloudinary.com/..."
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "statusCode": 201
}
```

### Respuesta de Error (400 Bad Request)

```json
{
  "ok": false,
  "error": {
    "name": "ValidationError",
    "data": {
      "files.images": "Máximo 10 imágenes permitidas"
    }
  }
}
```

## Validaciones de Archivos

### Imágenes

- **Tipos permitidos**: JPG, JPEG, PNG, GIF, WebP
- **Tamaño máximo**: 5MB por imagen
- **Cantidad máxima**: 10 imágenes
- **Campo**: Opcional

### Documentos

- **Tipos permitidos**: PDF, DOC, DOCX, TXT, RTF
- **Tamaño máximo**: 10MB por documento
- **Cantidad máxima**: 5 documentos
- **Campo**: Opcional

## Características de Cloudinary

1. **URLs Seguras**: Todas las URLs usan HTTPS
2. **Optimización Automática**: Cloudinary optimiza las imágenes automáticamente
3. **CDN Global**: Distribución global de contenido
4. **Transformaciones**: Posibilidad de aplicar transformaciones en tiempo real
5. **Backup Automático**: Respaldo automático de archivos

## Estructura de Carpetas en Cloudinary

- **Imágenes**: `red-horizon-portal/posts/images/`
- **Documentos**: `red-horizon-portal/posts/documents/`
- **Videos**: `red-horizon-portal/posts/videos/`

## Notas Importantes

1. **Autenticación**: Todas las operaciones de creación requieren token de autenticación
2. **Archivos Opcionales**: Los archivos son completamente opcionales
3. **Validación**: Se validan tanto en frontend como en backend
4. **Manejo de Errores**: Errores detallados para cada tipo de validación
5. **Escalabilidad**: Cloudinary maneja automáticamente el escalado de archivos
