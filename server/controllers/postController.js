const PostService = require("../services/postService");
const { uploadMultipleImages, uploadMultipleDocuments } = require("../helpers/cloudinary");
const { success, error } = require("../helpers/httpResponses");

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

        // Extraer los buffers de las imágenes
        const imageBuffers = imageFiles.map((file) => file.data);

        // Subir imágenes a Cloudinary
        const uploadedImages = await uploadMultipleImages(imageBuffers);

        // Guardar las URLs de las imágenes
        postData.images = uploadedImages.map((img) => img.secure_url);
      }

      // Procesar documentos si se subieron (completamente opcional)
      if (req.files && req.files.documents) {
        const documentFiles = Array.isArray(req.files.documents)
          ? req.files.documents
          : [req.files.documents];

        // Extraer los buffers de los documentos
        const documentBuffers = documentFiles.map((file) => file.data);

        // Subir documentos a Cloudinary
        const uploadedDocuments = await uploadMultipleDocuments(documentBuffers);

        // Guardar las URLs de los documentos
        postData.documents = uploadedDocuments.map((doc) => doc.secure_url);
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

      const updateData = {};
      if (title) updateData.title = title;
      if (category) updateData.category = category;
      if (description) updateData.description = description;

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
}

module.exports = new PostController();
