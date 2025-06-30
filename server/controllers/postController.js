const PostService = require("../services/postService");
const {
  uploadMultipleImages,
  uploadMultipleDocuments,
  deleteMultipleFiles,
} = require("../helpers/cloudinary");
const { success, error } = require("../helpers/httpResponses");
const { compareObjectIds } = require("../helpers/utils");

class PostController {
  async createPost(req, res, next) {
    try {
      const { title, category, description } = req.body;
      const authorId = req.user._id;

      const postData = {
        title,
        category,
        description,
        author: authorId,
        images: [],
        documents: [],
      };

      // Procesar imágenes si se subieron (completamente opcional)
      if (req.files && req.files.images) {
        const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

        // Preparar objetos con buffer y filename para Cloudinary
        const imageFilesForUpload = imageFiles.map((file) => ({
          buffer: file.data,
          filename: file.name || `image_${Date.now()}.jpg`,
        }));

        // Subir imágenes a Cloudinary
        const uploadedImages = await uploadMultipleImages(imageFilesForUpload);

        // Guardar la información completa de las imágenes
        postData.images = uploadedImages;
      }

      // Procesar documentos si se subieron (completamente opcional)
      if (req.files && req.files.documents) {
        const documentFiles = Array.isArray(req.files.documents)
          ? req.files.documents
          : [req.files.documents];

        // Preparar objetos con buffer y filename para Cloudinary
        const documentFilesForUpload = documentFiles.map((file) => ({
          buffer: file.data,
          filename: file.name || `document_${Date.now()}.pdf`,
        }));

        // Subir documentos a Cloudinary
        const uploadedDocuments = await uploadMultipleDocuments(documentFilesForUpload);

        // Guardar la información completa de los documentos
        postData.documents = uploadedDocuments;
      }

      const post = await PostService.createPost(postData);
      success(res, post, 201);
    } catch (err) {
      next(err);
    }
  }

  async getAllPosts(req, res, next) {
    try {
      const { page, limit, category, search, author, dateFilter } = req.query;
      const result = await PostService.getAllPosts({
        page,
        limit,
        category,
        search,
        author,
        dateFilter,
      });

      // Si hay búsqueda y no se encontraron resultados, enviar mensaje específico
      if (search && result.searchInfo && !result.searchInfo.hasResults) {
        return success(res, {
          ...result,
          message: `No se encontraron publicaciones que contengan "${result.searchInfo.query}" en el título o descripción.`,
        });
      }

      // Si hay búsqueda y se encontraron resultados, enviar mensaje informativo
      if (search && result.searchInfo && result.searchInfo.hasResults) {
        return success(res, {
          ...result,
          message: `Se encontraron ${result.searchInfo.resultsFound} publicación(es) que contienen "${result.searchInfo.query}".`,
        });
      }

      success(res, result);
    } catch (err) {
      next(err);
    }
  }

  // Método específico para posts públicos (sin autenticación)
  async getPublicPost(req, res, next) {
    try {
      const { id } = req.params;
      const post = await PostService.getPostById(id);

      // Respuesta específica para posts públicos
      success(res, post);
    } catch (err) {
      next(err);
    }
  }

  async getPostById(req, res, next) {
    try {
      const { id } = req.params;
      const post = await PostService.getPostById(id);
      success(res, post);
    } catch (err) {
      next(err);
    }
  }

  async updatePost(req, res, next) {
    try {
      const { id } = req.params;
      const { title, category, description } = req.body;
      const authorId = req.user._id;

      // Procesar arrays de eliminación como JSON strings o arrays
      let imagesToDelete = [];
      let documentsToDelete = [];

      if (req.body.imagesToDelete) {
        try {
          // Si es un string, parsearlo como JSON
          if (typeof req.body.imagesToDelete === "string") {
            imagesToDelete = JSON.parse(req.body.imagesToDelete);
          }
          // Si ya es un array, usarlo directamente
          else if (Array.isArray(req.body.imagesToDelete)) {
            imagesToDelete = req.body.imagesToDelete;
          }
        } catch (error) {
          console.error("Error al procesar imagesToDelete:", error);
          imagesToDelete = [];
        }
      }

      if (req.body.documentsToDelete) {
        try {
          // Si es un string, parsearlo como JSON
          if (typeof req.body.documentsToDelete === "string") {
            documentsToDelete = JSON.parse(req.body.documentsToDelete);
          }
          // Si ya es un array, usarlo directamente
          else if (Array.isArray(req.body.documentsToDelete)) {
            documentsToDelete = req.body.documentsToDelete;
          }
        } catch (error) {
          console.error("Error al procesar documentsToDelete:", error);
          documentsToDelete = [];
        }
      }

      const updateData = {};
      if (title) updateData.title = title;
      if (category) updateData.category = category;
      if (description) updateData.description = description;

      // Obtener el post actual para manejar los archivos
      const currentPost = await PostService.getPostById(id);

      // Verificar permisos
      if (!compareObjectIds(currentPost.author._id, authorId)) {
        return error(res, "No tienes permisos para editar esta publicación", 403);
      }

      // Procesar eliminación de imágenes
      if (imagesToDelete.length > 0) {
        const imagesToRemove = currentPost.images.filter((img) =>
          imagesToDelete.includes(img._id.toString())
        );

        if (imagesToRemove.length > 0) {
          // Eliminar archivos de Cloudinary
          const imageUrls = imagesToRemove.map((img) =>
            typeof img === "string" ? img : img.url || img.secureUrl
          );

          try {
            await deleteMultipleFiles(imageUrls, "image");
            console.log(`Eliminadas ${imageUrls.length} imágenes de Cloudinary`);
          } catch (error) {
            console.error("Error al eliminar imágenes de Cloudinary:", error);
          }
        }

        // Filtrar las imágenes que se van a mantener
        updateData.images = currentPost.images.filter(
          (img) => !imagesToDelete.includes(img._id.toString())
        );
      }

      // Procesar eliminación de documentos
      if (documentsToDelete.length > 0) {
        const documentsToRemove = currentPost.documents.filter((doc) =>
          documentsToDelete.includes(doc._id.toString())
        );

        if (documentsToRemove.length > 0) {
          // Eliminar archivos de Cloudinary
          const documentUrls = documentsToRemove.map((doc) =>
            typeof doc === "string" ? doc : doc.url || doc.secureUrl
          );

          try {
            await deleteMultipleFiles(documentUrls, "raw");
            console.log(`Eliminados ${documentUrls.length} documentos de Cloudinary`);
          } catch (error) {
            console.error("Error al eliminar documentos de Cloudinary:", error);
          }
        }

        // Filtrar los documentos que se van a mantener
        updateData.documents = currentPost.documents.filter(
          (doc) => !documentsToDelete.includes(doc._id.toString())
        );
      }

      // Procesar nuevas imágenes si se subieron
      if (req.files && req.files.images) {
        const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

        // Preparar objetos con buffer y filename para Cloudinary
        const imageFilesForUpload = imageFiles.map((file) => ({
          buffer: file.data,
          filename: file.name || `image_${Date.now()}.jpg`,
        }));

        // Subir nuevas imágenes a Cloudinary
        const uploadedImages = await uploadMultipleImages(imageFilesForUpload);

        // Agregar las nuevas imágenes a las existentes
        updateData.images = [...(updateData.images || currentPost.images), ...uploadedImages];
      }

      // Procesar nuevos documentos si se subieron
      if (req.files && req.files.documents) {
        const documentFiles = Array.isArray(req.files.documents)
          ? req.files.documents
          : [req.files.documents];

        // Preparar objetos con buffer y filename para Cloudinary
        const documentFilesForUpload = documentFiles.map((file) => ({
          buffer: file.data,
          filename: file.name || `document_${Date.now()}.pdf`,
        }));

        // Subir nuevos documentos a Cloudinary
        const uploadedDocuments = await uploadMultipleDocuments(documentFilesForUpload);

        // Agregar los nuevos documentos a los existentes
        updateData.documents = [
          ...(updateData.documents || currentPost.documents),
          ...uploadedDocuments,
        ];
      }

      const post = await PostService.updatePost({
        id,
        authorId,
        updateData,
      });
      success(res, post);
    } catch (err) {
      next(err);
    }
  }

  async deletePost(req, res, next) {
    try {
      const { id } = req.params;
      const authorId = req.user._id;

      const result = await PostService.deletePost({ id, authorId });

      // Preparar mensaje de respuesta
      let message = "Publicación eliminada exitosamente";

      if (result.cloudinaryCleanup) {
        const { images, documents } = result.cloudinaryCleanup;
        const totalDeleted = images.deleted + documents.deleted;
        const totalFailed = images.failed + documents.failed;

        if (totalDeleted > 0) {
          message += `. Se eliminaron ${totalDeleted} archivo(s) de Cloudinary`;
        }

        if (totalFailed > 0) {
          message += `. No se pudieron eliminar ${totalFailed} archivo(s)`;
        }
      }

      success(res, {
        post: result.post,
        cloudinaryCleanup: result.cloudinaryCleanup,
        message,
      });
    } catch (err) {
      next(err);
    }
  }

  async getPostsByCategory(req, res, next) {
    try {
      const { category } = req.params;
      const posts = await PostService.getPostsByCategory(category);
      success(res, posts);
    } catch (err) {
      next(err);
    }
  }

  async getStats(req, res, next) {
    try {
      const stats = await PostService.getStats();
      success(res, stats);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PostController();
