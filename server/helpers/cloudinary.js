const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

/**
 * Sube una imagen a Cloudinary usando upload_stream
 * @param {Buffer} imageBuffer - Buffer de la imagen
 * @param {Object} options - Opciones adicionales para la subida
 * @param {string} originalFilename - Nombre original del archivo
 * @returns {Promise<Object>} Resultado de la subida con información completa
 */
function uploadImage(imageBuffer, options = {}, originalFilename = "image") {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: "red-horizon-portal/posts/images",
      resource_type: "image",
      ...options,
    };

    const streamUpload = cloudinary.uploader.upload_stream(uploadOptions, (err, result) => {
      if (err) return reject(err);

      // Crear objeto con información completa
      const fileInfo = {
        url: result.secure_url,
        filename: originalFilename,
        size: result.bytes,
        mimeType: result.format ? `image/${result.format}` : "image/jpeg",
        publicId: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        secureUrl: result.secure_url,
      };

      resolve(fileInfo);
    });

    streamifier.createReadStream(imageBuffer).pipe(streamUpload);
  });
}

/**
 * Sube un documento a Cloudinary usando upload_stream
 * @param {Buffer} documentBuffer - Buffer del documento
 * @param {Object} options - Opciones adicionales para la subida
 * @param {string} originalFilename - Nombre original del archivo
 * @returns {Promise<Object>} Resultado de la subida con información completa
 */
function uploadDocument(documentBuffer, options = {}, originalFilename = "document") {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: "red-horizon-portal/posts/documents",
      resource_type: "raw",
      ...options,
    };

    const streamUpload = cloudinary.uploader.upload_stream(uploadOptions, (err, result) => {
      if (err) return reject(err);

      // Crear objeto con información completa
      const fileInfo = {
        url: result.secure_url,
        filename: originalFilename,
        size: result.bytes,
        mimeType: result.format ? `application/${result.format}` : "application/octet-stream",
        publicId: result.public_id,
        format: result.format,
        bytes: result.bytes,
        secureUrl: result.secure_url,
      };

      resolve(fileInfo);
    });

    streamifier.createReadStream(documentBuffer).pipe(streamUpload);
  });
}

/**
 * Sube múltiples imágenes a Cloudinary
 * @param {Array<Object>} imageFiles - Array de objetos con buffer y filename
 * @param {Object} options - Opciones adicionales para la subida
 * @returns {Promise<Array<Object>>} Array de resultados de subida con información completa
 */
async function uploadMultipleImages(imageFiles, options = {}) {
  try {
    const uploadPromises = imageFiles.map((file) =>
      uploadImage(file.buffer, options, file.filename)
    );
    return await Promise.all(uploadPromises);
  } catch (error) {
    throw new Error(`Error al subir imágenes: ${error.message}`);
  }
}

/**
 * Sube múltiples documentos a Cloudinary
 * @param {Array<Object>} documentFiles - Array de objetos con buffer y filename
 * @param {Object} options - Opciones adicionales para la subida
 * @returns {Promise<Array<Object>>} Array de resultados de subida con información completa
 */
async function uploadMultipleDocuments(documentFiles, options = {}) {
  try {
    const uploadPromises = documentFiles.map((file) =>
      uploadDocument(file.buffer, options, file.filename)
    );
    return await Promise.all(uploadPromises);
  } catch (error) {
    throw new Error(`Error al subir documentos: ${error.message}`);
  }
}

/**
 * Elimina un archivo de Cloudinary por su public_id
 * @param {string} publicId - ID público del archivo en Cloudinary
 * @param {string} resourceType - Tipo de recurso ('image', 'video', 'raw')
 * @returns {Promise<Object>} Resultado de la eliminación
 */
function deleteFile(publicId, resourceType = "image") {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, { resource_type: resourceType }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

/**
 * Extrae el public_id de una URL de Cloudinary
 * @param {string} url - URL completa de Cloudinary
 * @returns {string|null} Public ID extraído o null si no se puede extraer
 */
function extractPublicIdFromUrl(url) {
  try {
    // Patrón para extraer public_id de URLs de Cloudinary
    const pattern = /\/upload\/[^\/]+\/(.+?)(?:\.[^\/]+)?$/;
    const match = url.match(pattern);

    if (match && match[1]) {
      // Decodificar el public_id (puede contener caracteres especiales)
      return decodeURIComponent(match[1]);
    }

    return null;
  } catch (error) {
    console.error("Error al extraer public_id de URL:", error);
    return null;
  }
}

/**
 * Elimina múltiples archivos de Cloudinary
 * @param {Array<string>} urls - Array de URLs de Cloudinary
 * @param {string} resourceType - Tipo de recurso ('image', 'video', 'raw')
 * @returns {Promise<Array<Object>>} Array de resultados de eliminación
 */
async function deleteMultipleFiles(urls, resourceType = "image") {
  try {
    const deletePromises = urls.map((url) => {
      const publicId = extractPublicIdFromUrl(url);
      if (publicId) {
        return deleteFile(publicId, resourceType);
      } else {
        console.warn(`No se pudo extraer public_id de la URL: ${url}`);
        return Promise.resolve({ deleted: false, error: "Invalid URL" });
      }
    });

    return await Promise.all(deletePromises);
  } catch (error) {
    throw new Error(`Error al eliminar archivos: ${error.message}`);
  }
}

/**
 * Determina si un archivo es un objeto completo o una URL string
 * @param {Object|string} file - Archivo a verificar
 * @returns {boolean} true si es un objeto completo, false si es una URL string
 */
function isCompleteFileObject(file) {
  return typeof file === "object" && file !== null && file.publicId;
}

/**
 * Elimina todas las imágenes y documentos de un post
 * @param {Object} post - Objeto del post con arrays de images y documents
 * @returns {Promise<Object>} Resultado de la eliminación
 */
async function deletePostFiles(post) {
  try {
    const results = {
      images: { deleted: 0, failed: 0, errors: [] },
      documents: { deleted: 0, failed: 0, errors: [] },
    };

    // Eliminar imágenes
    if (post.images && post.images.length > 0) {
      try {
        // Usar directamente los publicId de los objetos de imagen
        const imageDeletePromises = post.images.map((img) => {
          // Verificar si es un objeto completo o una URL string (compatibilidad)
          if (isCompleteFileObject(img)) {
            return deleteFile(img.publicId, "image");
          } else {
            // Es una URL string (post antiguo)
            const publicId = extractPublicIdFromUrl(img);
            if (publicId) {
              return deleteFile(publicId, "image");
            } else {
              return Promise.resolve({ result: "error", error: "No se pudo obtener publicId" });
            }
          }
        });

        const imageResults = await Promise.all(imageDeletePromises);
        imageResults.forEach((result, index) => {
          if (result.result === "ok" || result.deleted) {
            results.images.deleted++;
          } else {
            results.images.failed++;
            const fileName = isCompleteFileObject(post.images[index])
              ? post.images[index].filename || "sin nombre"
              : `imagen_${index + 1}`;
            results.images.errors.push(
              `Imagen ${index + 1} (${fileName}): ${result.error || "Error desconocido"}`
            );
          }
        });
      } catch (error) {
        results.images.failed = post.images.length;
        results.images.errors.push(`Error general: ${error.message}`);
      }
    }

    // Eliminar documentos
    if (post.documents && post.documents.length > 0) {
      try {
        // Usar directamente los publicId de los objetos de documento
        const documentDeletePromises = post.documents.map((doc) => {
          // Verificar si es un objeto completo o una URL string (compatibilidad)
          if (isCompleteFileObject(doc)) {
            return deleteFile(doc.publicId, "raw");
          } else {
            // Es una URL string (post antiguo)
            const publicId = extractPublicIdFromUrl(doc);
            if (publicId) {
              return deleteFile(publicId, "raw");
            } else {
              return Promise.resolve({ result: "error", error: "No se pudo obtener publicId" });
            }
          }
        });

        const documentResults = await Promise.all(documentDeletePromises);
        documentResults.forEach((result, index) => {
          if (result.result === "ok" || result.deleted) {
            results.documents.deleted++;
          } else {
            results.documents.failed++;
            const fileName = isCompleteFileObject(post.documents[index])
              ? post.documents[index].filename || "sin nombre"
              : `documento_${index + 1}`;
            results.documents.errors.push(
              `Documento ${index + 1} (${fileName}): ${result.error || "Error desconocido"}`
            );
          }
        });
      } catch (error) {
        results.documents.failed = post.documents.length;
        results.documents.errors.push(`Error general: ${error.message}`);
      }
    }

    return results;
  } catch (error) {
    throw new Error(`Error al eliminar archivos del post: ${error.message}`);
  }
}

/**
 * Sube un video a Cloudinary usando upload_stream
 * @param {Buffer} videoBuffer - Buffer del video
 * @param {Object} options - Opciones adicionales para la subida
 * @returns {Promise<Object>} Resultado de la subida
 */
function uploadVideo(videoBuffer, options = {}) {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: "red-horizon-portal/posts/videos",
      resource_type: "video",
      ...options,
    };

    const streamUpload = cloudinary.uploader.upload_stream(uploadOptions, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });

    streamifier.createReadStream(videoBuffer).pipe(streamUpload);
  });
}

module.exports = {
  uploadImage,
  uploadDocument,
  uploadMultipleImages,
  uploadMultipleDocuments,
  uploadVideo,
  deleteFile,
  deleteMultipleFiles,
  deletePostFiles,
  extractPublicIdFromUrl,
  isCompleteFileObject,
};
