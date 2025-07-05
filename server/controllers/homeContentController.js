const homeContentService = require("../services/homeContentService");
const {
  uploadMultipleGalleryImages,
  uploadMultipleDownloadDocuments,
  deleteMultipleFiles,
  uploadGalleryImage,
  uploadDownloadDocument,
  deleteFile,
} = require("../helpers/cloudinary");
const { success, error } = require("../helpers/httpResponses");

async function getHomeContent(req, res) {
  try {
    const content = await homeContentService.getHomeContent();
    return success(res, content);
  } catch (err) {
    console.error(err);
    return error(res, err);
  }
}

async function getAdminHomeContent(req, res) {
  try {
    const content = await homeContentService.getHomeContent();
    return success(res, content);
  } catch (err) {
    console.error(err);
    return error(res, err);
  }
}

async function createOrUpdateHomeContent(req, res) {
  try {
    console.log("createOrUpdateHomeContent - Datos recibidos:", req.body);

    const contentData = req.body;

    // Parsear el contenido si viene como string
    let parsedContent;
    try {
      parsedContent = typeof contentData === "string" ? JSON.parse(contentData) : contentData;
    } catch (parseError) {
      return error(res, "Formato de datos inválido");
    }

    console.log("createOrUpdateHomeContent - Contenido parseado:", parsedContent);
    console.log(
      "createOrUpdateHomeContent - mainImage en contenido:",
      parsedContent.info?.mainImage
    );

    if (
      !parsedContent.hero ||
      !parsedContent.features ||
      !parsedContent.downloads ||
      !parsedContent.info ||
      !parsedContent.gallery
    ) {
      return error(res, "Todos los campos del contenido son requeridos");
    }

    // Procesar archivos de descarga si se subieron
    if (req.files && req.files.downloadFiles) {
      const downloadFiles = Array.isArray(req.files.downloadFiles)
        ? req.files.downloadFiles
        : [req.files.downloadFiles];

      // Subir documentos a Cloudinary
      const uploadedDownloads = await uploadMultipleDownloadDocuments(
        downloadFiles.map((file) => ({
          buffer: file.data,
          filename: file.name || `download_${Date.now()}.pdf`,
        }))
      );

      // Agregar los archivos subidos a la sección de descargas
      uploadedDownloads.forEach((file, index) => {
        const newItem = {
          id: `uploaded_${Date.now()}_${index}`,
          title: file.filename,
          description: `Archivo subido: ${file.filename}`,
          type: "pdf", // Por defecto, se puede cambiar después
          url: file.url,
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          publicId: file.publicId,
        };
        parsedContent.downloads.items.push(newItem);
      });
    }

    // Procesar imágenes de galería si se subieron
    if (req.files && req.files.galleryImages) {
      const galleryFiles = Array.isArray(req.files.galleryImages)
        ? req.files.galleryImages
        : [req.files.galleryImages];

      // Subir imágenes a Cloudinary
      const uploadedImages = await uploadMultipleGalleryImages(
        galleryFiles.map((file) => ({
          buffer: file.data,
          filename: file.name || `gallery_${Date.now()}.jpg`,
        }))
      );

      // Agregar las imágenes subidas a la galería
      uploadedImages.forEach((file, index) => {
        const newImage = {
          id: `uploaded_${Date.now()}_${index}`,
          url: file.url,
          title: file.filename,
          description: `Imagen subida: ${file.filename}`,
          publicId: file.publicId,
        };
        parsedContent.gallery.images.push(newImage);
      });
    }

    const savedContent = await homeContentService.createOrUpdateHomeContent(parsedContent);
    console.log("createOrUpdateHomeContent - Contenido guardado:", savedContent);
    console.log("createOrUpdateHomeContent - mainImage guardado:", savedContent.info?.mainImage);
    return success(res, savedContent);
  } catch (err) {
    console.error(err);
    return error(res, err);
  }
}

// Función para subir un archivo de descarga individual
async function uploadDownloadFile(req, res) {
  try {
    if (!req.files || !req.files.file) {
      return error(res, "No se proporcionó ningún archivo");
    }

    const file = req.files.file;
    const { title, description, type, itemId } = req.body;

    // Validar tipo de archivo
    const allowedTypes = ["pdf", "doc", "docx", "xls", "xlsx", "txt"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    if (!allowedTypes.includes(fileExtension)) {
      return error(res, "Tipo de archivo no permitido");
    }

    // Subir documento a Cloudinary
    const uploadedFile = await uploadDownloadDocument(
      file.data,
      {},
      file.name || `download_${Date.now()}.${fileExtension}`
    );

    // Crear objeto del archivo subido
    const newDownloadItem = {
      id: itemId || `uploaded_${Date.now()}`,
      title: title || uploadedFile.filename,
      description: description || `Archivo subido: ${uploadedFile.filename}`,
      type: type || fileExtension,
      url: uploadedFile.url,
      size: `${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB`,
      publicId: uploadedFile.publicId,
    };

    // Actualizar el item en el contenido
    const savedContent = await homeContentService.updateDownloadItem(
      itemId || newDownloadItem.id,
      newDownloadItem
    );

    return success(res, {
      message: "Archivo subido exitosamente",
      file: newDownloadItem,
      content: savedContent,
    });
  } catch (err) {
    console.error(err);
    return error(res, err);
  }
}

// Función para subir una imagen de galería individual
async function uploadGalleryImageFile(req, res) {
  try {
    if (!req.files || !req.files.file) {
      return error(res, "No se proporcionó ninguna imagen");
    }

    const file = req.files.file;
    const { title, description, itemId } = req.body;

    // Validar tipo de archivo
    const allowedTypes = ["jpg", "jpeg", "png", "gif", "webp"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    if (!allowedTypes.includes(fileExtension)) {
      return error(res, "Tipo de imagen no permitido");
    }

    // Subir imagen a Cloudinary
    const uploadedImage = await uploadGalleryImage(
      file.data,
      {},
      file.name || `gallery_${Date.now()}.${fileExtension}`
    );

    // Crear objeto de la imagen subida
    const newGalleryImage = {
      id: itemId || `uploaded_${Date.now()}`,
      url: uploadedImage.url,
      title: title || uploadedImage.filename,
      description: description || `Imagen subida: ${uploadedImage.filename}`,
      publicId: uploadedImage.publicId,
    };

    // Actualizar la imagen en el contenido
    const savedContent = await homeContentService.updateGalleryImage(
      itemId || newGalleryImage.id,
      newGalleryImage
    );

    return success(res, {
      message: "Imagen subida exitosamente",
      image: newGalleryImage,
      content: savedContent,
    });
  } catch (err) {
    console.error(err);
    return error(res, err);
  }
}

// Función para subir la imagen principal de la sección de información
async function uploadInfoMainImage(req, res) {
  try {
    console.log("uploadInfoMainImage - Iniciando subida de imagen principal");

    if (!req.files || !req.files.file) {
      console.log("uploadInfoMainImage - No se encontró archivo");
      return error(res, "No se proporcionó ninguna imagen");
    }

    const file = req.files.file;
    const { title, description } = req.body;

    console.log("uploadInfoMainImage - Datos recibidos:", {
      fileName: file.name,
      fileSize: file.size,
      title,
      description,
    });

    // Validar tipo de archivo
    const allowedTypes = ["jpg", "jpeg", "png", "gif", "webp"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    if (!allowedTypes.includes(fileExtension)) {
      console.log("uploadInfoMainImage - Tipo de archivo no permitido:", fileExtension);
      return error(res, "Tipo de imagen no permitido");
    }

    // Subir imagen a Cloudinary
    console.log("uploadInfoMainImage - Subiendo a Cloudinary...");
    const uploadedImage = await uploadGalleryImage(
      file.data,
      {},
      file.name || `info-main_${Date.now()}.${fileExtension}`
    );

    console.log("uploadInfoMainImage - Imagen subida a Cloudinary:", uploadedImage);

    // Crear objeto de la imagen subida
    const newMainImage = {
      url: uploadedImage.url,
      title: title || uploadedImage.filename,
      description: description || `Imagen principal: ${uploadedImage.filename}`,
      publicId: uploadedImage.publicId,
    };

    console.log("uploadInfoMainImage - Objeto de imagen creado:", newMainImage);

    // Actualizar la imagen principal en el contenido
    console.log("uploadInfoMainImage - Actualizando en base de datos...");
    const savedContent = await homeContentService.updateInfoMainImage(newMainImage);

    console.log("uploadInfoMainImage - Contenido guardado:", savedContent.info.mainImage);

    return success(res, {
      message: "Imagen principal subida exitosamente",
      image: newMainImage,
      content: savedContent,
    });
  } catch (err) {
    console.error("uploadInfoMainImage - Error:", err);
    return error(res, err);
  }
}

async function getHomeContentHistory(req, res) {
  try {
    const { limit = 10, page = 1 } = req.query;
    const history = await homeContentService.getHomeContentHistory(parseInt(limit), parseInt(page));
    return success(res, history);
  } catch (err) {
    console.error(err);
    return error(res, err);
  }
}

async function restoreHomeContent(req, res) {
  try {
    const { contentId } = req.params;
    if (!contentId) {
      return errorResponse(res, "ID del contenido es requerido");
    }
    const restoredContent = await homeContentService.restoreHomeContent(contentId);
    return success(res, restoredContent);
  } catch (err) {
    console.error(err);
    return error(res, err);
  }
}

async function deleteHomeContent(req, res) {
  try {
    const { contentId } = req.params;
    if (!contentId) {
      return errorResponse(res, "ID del contenido es requerido");
    }
    await homeContentService.deleteHomeContent(contentId);
    return success(res, "Contenido eliminado exitosamente");
  } catch (err) {
    console.error(err);
    return error(res, err);
  }
}

async function getHomeContentStats(req, res) {
  try {
    const stats = await homeContentService.getHomeContentStats();
    return success(res, stats);
  } catch (err) {
    console.error(err);
    return error(res, err);
  }
}

// Función para eliminar una imagen de galería
async function deleteGalleryImage(req, res) {
  try {
    const { imageId } = req.params;

    if (!imageId) {
      return error(res, "ID de imagen es requerido");
    }

    // Obtener el contenido actual para encontrar la imagen
    const currentContent = await homeContentService.getHomeContent();

    if (!currentContent) {
      return error(res, "No se encontró contenido activo");
    }

    // Buscar la imagen en la galería
    const image = currentContent.gallery.images.find((img) => img.id === imageId);

    if (!image) {
      return error(res, "Imagen no encontrada");
    }

    // Eliminar la imagen de Cloudinary si tiene publicId
    if (image.publicId) {
      try {
        await deleteFile(image.publicId);
        console.log(`Imagen eliminada de Cloudinary: ${image.publicId}`);
      } catch (cloudinaryError) {
        console.error("Error al eliminar imagen de Cloudinary:", cloudinaryError);
        // Continuar aunque falle la eliminación en Cloudinary
      }
    }

    // Eliminar la imagen del contenido
    const updatedContent = await homeContentService.deleteGalleryImage(imageId);

    return success(res, {
      message: "Imagen eliminada exitosamente",
      content: updatedContent,
    });
  } catch (err) {
    console.error(err);
    return error(res, err);
  }
}

module.exports = {
  getHomeContent,
  getAdminHomeContent,
  createOrUpdateHomeContent,
  getHomeContentHistory,
  restoreHomeContent,
  deleteHomeContent,
  getHomeContentStats,
  uploadDownloadFile,
  uploadGalleryImageFile,
  uploadInfoMainImage,
  deleteGalleryImage,
};
