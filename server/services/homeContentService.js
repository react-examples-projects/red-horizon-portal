const HomeContent = require("../models/HomeContent");

class HomeContentService {
  /**
   * Obtiene el contenido activo del Home
   * @returns {Promise<Object>} El contenido del Home
   */
  async getHomeContent() {
    try {
      const content = await HomeContent.findOne({ isActive: true }).sort({ createdAt: -1 });
      return content; // Puede ser null si no hay contenido
    } catch (error) {
      throw new Error(`Error al obtener el contenido del Home: ${error.message}`);
    }
  }

  /**
   * Crea o actualiza el contenido del Home
   * @param {Object} contentData - Los datos del contenido
   * @returns {Promise<Object>} El contenido creado/actualizado
   */
  async createOrUpdateHomeContent(contentData) {
    try {
      console.log("createOrUpdateHomeContent - Iniciando creación/actualización");
      console.log("createOrUpdateHomeContent - Datos recibidos:", contentData);
      console.log("createOrUpdateHomeContent - mainImage recibido:", contentData.info?.mainImage);

      // Buscar contenido activo existente
      const existingContent = await HomeContent.findOne({ isActive: true });

      // Eliminar _id si viene del frontend
      if (contentData._id) {
        delete contentData._id;
      }

      // Asegurar que mainImage sea null si no está definido
      if (contentData.info && contentData.info.mainImage === undefined) {
        contentData.info.mainImage = null;
      }

      console.log(
        "createOrUpdateHomeContent - mainImage después de procesar:",
        contentData.info?.mainImage
      );

      if (existingContent) {
        // Actualizar contenido existente
        console.log("createOrUpdateHomeContent - Actualizando contenido existente");
        const updatedContent = await HomeContent.findByIdAndUpdate(
          existingContent._id,
          {
            ...contentData,
            isActive: true,
            updatedAt: new Date(),
          },
          { new: true, runValidators: true }
        );
        console.log("createOrUpdateHomeContent - Contenido actualizado:", updatedContent);
        console.log(
          "createOrUpdateHomeContent - mainImage en contenido actualizado:",
          updatedContent.info?.mainImage
        );
        return updatedContent;
      } else {
        // Crear nuevo contenido si no existe
        console.log("createOrUpdateHomeContent - Creando nuevo contenido");
        const newContent = new HomeContent({
          ...contentData,
          isActive: true,
        });

        const savedContent = await newContent.save();
        console.log("createOrUpdateHomeContent - Contenido creado:", savedContent);
        console.log(
          "createOrUpdateHomeContent - mainImage en contenido creado:",
          savedContent.info?.mainImage
        );
        return savedContent;
      }
    } catch (error) {
      throw new Error(`Error al crear/actualizar el contenido del Home: ${error.message}`);
    }
  }

  /**
   * Actualiza un item específico en la sección de descargas
   * @param {string} itemId - ID del item a actualizar
   * @param {Object} itemData - Datos del item
   * @returns {Promise<Object>} El contenido actualizado
   */
  async updateDownloadItem(itemId, itemData) {
    try {
      // Buscar el contenido activo
      const currentContent = await HomeContent.findOne({ isActive: true });

      if (!currentContent) {
        throw new Error("No se encontró contenido activo");
      }

      // Buscar el item existente
      const itemIndex = currentContent.downloads.items.findIndex((item) => item.id === itemId);

      if (itemIndex !== -1) {
        // Actualizar item existente usando $set para el array específico
        const updateQuery = {
          [`downloads.items.${itemIndex}`]: itemData,
        };

        const updatedContent = await HomeContent.findOneAndUpdate(
          { _id: currentContent._id },
          { $set: updateQuery },
          { new: true, runValidators: false }
        );

        return updatedContent;
      } else {
        // Agregar nuevo item usando $push
        const updatedContent = await HomeContent.findOneAndUpdate(
          { _id: currentContent._id },
          { $push: { "downloads.items": itemData } },
          { new: true, runValidators: false }
        );

        return updatedContent;
      }
    } catch (error) {
      throw new Error(`Error al actualizar item de descarga: ${error.message}`);
    }
  }

  /**
   * Actualiza una imagen específica en la galería
   * @param {string} imageId - ID de la imagen a actualizar
   * @param {Object} imageData - Datos de la imagen
   * @returns {Promise<Object>} El contenido actualizado
   */
  async updateGalleryImage(imageId, imageData) {
    try {
      // Buscar el contenido activo
      const currentContent = await HomeContent.findOne({ isActive: true });

      if (!currentContent) {
        throw new Error("No se encontró contenido activo");
      }

      // Buscar la imagen existente
      const imageIndex = currentContent.gallery.images.findIndex((image) => image.id === imageId);

      if (imageIndex !== -1) {
        // Actualizar imagen existente usando $set para el array específico
        const updateQuery = {
          [`gallery.images.${imageIndex}`]: imageData,
        };

        const updatedContent = await HomeContent.findOneAndUpdate(
          { _id: currentContent._id },
          { $set: updateQuery },
          { new: true, runValidators: false }
        );

        return updatedContent;
      } else {
        // Agregar nueva imagen usando $push
        const updatedContent = await HomeContent.findOneAndUpdate(
          { _id: currentContent._id },
          { $push: { "gallery.images": imageData } },
          { new: true, runValidators: false }
        );

        return updatedContent;
      }
    } catch (error) {
      throw new Error(`Error al actualizar imagen de galería: ${error.message}`);
    }
  }

  /**
   * Actualiza la imagen principal de la sección de información
   * @param {Object} imageData - Datos de la imagen
   * @returns {Promise<Object>} El contenido actualizado
   */
  async updateInfoMainImage(imageData) {
    try {
      console.log("updateInfoMainImage - Iniciando actualización");
      console.log("updateInfoMainImage - Datos de imagen recibidos:", imageData);

      // Buscar el contenido activo
      const currentContent = await HomeContent.findOne({ isActive: true });

      if (!currentContent) {
        console.log("updateInfoMainImage - No se encontró contenido activo");
        throw new Error("No se encontró contenido activo");
      }

      console.log("updateInfoMainImage - Contenido actual encontrado:", currentContent._id);
      console.log("updateInfoMainImage - mainImage actual:", currentContent.info.mainImage);

      // Actualizar la imagen principal de la sección info
      const updatedContent = await HomeContent.findOneAndUpdate(
        { _id: currentContent._id },
        {
          $set: {
            "info.mainImage": imageData,
            updatedAt: new Date(),
          },
        },
        { new: true, runValidators: false }
      );

      console.log("updateInfoMainImage - Contenido actualizado:", updatedContent._id);
      console.log(
        "updateInfoMainImage - mainImage después de actualizar:",
        updatedContent.info.mainImage
      );

      return updatedContent;
    } catch (error) {
      console.error("updateInfoMainImage - Error:", error);
      throw new Error(`Error al actualizar imagen principal de información: ${error.message}`);
    }
  }

  /**
   * Obtiene el historial de contenido del Home
   * @param {number} limit - Límite de resultados
   * @param {number} page - Página actual
   * @returns {Promise<Object>} Lista paginada del historial
   */
  async getHomeContentHistory(limit = 10, page = 1) {
    try {
      const skip = (page - 1) * limit;

      const [content, total] = await Promise.all([
        HomeContent.find().sort({ createdAt: -1 }).skip(skip).limit(limit).select("-__v"),
        HomeContent.countDocuments(),
      ]);

      return {
        content,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      throw new Error(`Error al obtener el historial del contenido: ${error.message}`);
    }
  }

  /**
   * Restaura una versión anterior del contenido
   * @param {string} contentId - ID del contenido a restaurar
   * @returns {Promise<Object>} El contenido restaurado
   */
  async restoreHomeContent(contentId) {
    try {
      const contentToRestore = await HomeContent.findById(contentId);

      if (!contentToRestore) {
        throw new Error("Contenido no encontrado");
      }

      // Desactivar contenido actual
      await HomeContent.updateMany({}, { isActive: false });

      // Activar el contenido seleccionado
      contentToRestore.isActive = true;
      const restoredContent = await contentToRestore.save();

      return restoredContent;
    } catch (error) {
      throw new Error(`Error al restaurar el contenido: ${error.message}`);
    }
  }

  /**
   * Elimina una versión del contenido
   * @param {string} contentId - ID del contenido a eliminar
   * @returns {Promise<boolean>} True si se eliminó correctamente
   */
  async deleteHomeContent(contentId) {
    try {
      const content = await HomeContent.findById(contentId);

      if (!content) {
        throw new Error("Contenido no encontrado");
      }

      // No permitir eliminar el contenido activo
      if (content.isActive) {
        throw new Error("No se puede eliminar el contenido activo");
      }

      await HomeContent.findByIdAndDelete(contentId);
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar el contenido: ${error.message}`);
    }
  }

  /**
   * Obtiene estadísticas del contenido del Home
   * @returns {Promise<Object>} Estadísticas del contenido
   */
  async getHomeContentStats() {
    try {
      const [totalVersions, activeContent] = await Promise.all([
        HomeContent.countDocuments(),
        HomeContent.findOne({ isActive: true }),
      ]);

      return {
        totalVersions,
        hasActiveContent: !!activeContent,
        lastUpdate: activeContent ? activeContent.updatedAt : null,
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }
}

module.exports = new HomeContentService();
