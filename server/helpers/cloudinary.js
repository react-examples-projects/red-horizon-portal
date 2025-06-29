const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

/**
 * Sube una imagen a Cloudinary usando upload_stream
 * @param {Buffer} imageBuffer - Buffer de la imagen
 * @param {Object} options - Opciones adicionales para la subida
 * @returns {Promise<Object>} Resultado de la subida
 */
function uploadImage(imageBuffer, options = {}) {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: "red-horizon-portal/posts/images",
      resource_type: "image",
      ...options,
    };

    const streamUpload = cloudinary.uploader.upload_stream(uploadOptions, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });

    streamifier.createReadStream(imageBuffer).pipe(streamUpload);
  });
}

/**
 * Sube un documento a Cloudinary usando upload_stream
 * @param {Buffer} documentBuffer - Buffer del documento
 * @param {Object} options - Opciones adicionales para la subida
 * @returns {Promise<Object>} Resultado de la subida
 */
function uploadDocument(documentBuffer, options = {}) {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: "red-horizon-portal/posts/documents",
      resource_type: "raw",
      ...options,
    };

    const streamUpload = cloudinary.uploader.upload_stream(uploadOptions, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });

    streamifier.createReadStream(documentBuffer).pipe(streamUpload);
  });
}

/**
 * Sube múltiples imágenes a Cloudinary
 * @param {Array<Buffer>} imageBuffers - Array de buffers de imágenes
 * @param {Object} options - Opciones adicionales para la subida
 * @returns {Promise<Array<Object>>} Array de resultados de subida
 */
async function uploadMultipleImages(imageBuffers, options = {}) {
  try {
    const uploadPromises = imageBuffers.map((buffer) => uploadImage(buffer, options));
    return await Promise.all(uploadPromises);
  } catch (error) {
    throw new Error(`Error al subir imágenes: ${error.message}`);
  }
}

/**
 * Sube múltiples documentos a Cloudinary
 * @param {Array<Buffer>} documentBuffers - Array de buffers de documentos
 * @param {Object} options - Opciones adicionales para la subida
 * @returns {Promise<Array<Object>>} Array de resultados de subida
 */
async function uploadMultipleDocuments(documentBuffers, options = {}) {
  try {
    const uploadPromises = documentBuffers.map((buffer) => uploadDocument(buffer, options));
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
        const imageResults = await deleteMultipleFiles(post.images, "image");
        imageResults.forEach((result, index) => {
          if (result.result === "ok" || result.deleted) {
            results.images.deleted++;
          } else {
            results.images.failed++;
            results.images.errors.push(
              `Imagen ${index + 1}: ${result.error || "Error desconocido"}`
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
        const documentResults = await deleteMultipleFiles(post.documents, "raw");
        documentResults.forEach((result, index) => {
          if (result.result === "ok" || result.deleted) {
            results.documents.deleted++;
          } else {
            results.documents.failed++;
            results.documents.errors.push(
              `Documento ${index + 1}: ${result.error || "Error desconocido"}`
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
};
