const PostService = require("../services/postService");
const { uploadImages, uploadDocuments } = require("../helpers/requests");
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

        const uploadedImages = await Promise.all(imageFiles.map((file) => uploadImages(file.data)));

        postData.images = uploadedImages.map((img) => img.url);
      }

      // Procesar documentos si se subieron (completamente opcional)
      if (req.files && req.files.documents) {
        const documentFiles = Array.isArray(req.files.documents)
          ? req.files.documents
          : [req.files.documents];

        const uploadedDocuments = await Promise.all(
          documentFiles.map((file) => uploadDocuments(file.data))
        );

        postData.documents = uploadedDocuments.map((doc) => doc.url);
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

  // Método de debugging para obtener posts en orden natural
  async getAllPostsNaturalOrder(req, res, next) {
    try {
      const { page, limit } = req.query;
      const result = await PostService.getAllPostsNaturalOrder({
        page,
        limit,
      });
      success(res, result);
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
      success(res, post, "Publicación actualizada exitosamente");
    } catch (err) {
      next(err);
    }
  }

  async deletePost(req, res, next) {
    try {
      const { id } = req.params;
      const authorId = req.user._id;

      const post = await PostService.deletePost({ id, authorId });
      success(res, post, "Publicación eliminada exitosamente");
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

  async getPostsByAuthor(req, res, next) {
    try {
      const { authorId } = req.params;
      const posts = await PostService.getPostsByAuthor(authorId);
      success(res, posts);
    } catch (err) {
      next(err);
    }
  }

  async getMyPosts(req, res, next) {
    try {
      const authorId = req.user._id;
      const posts = await PostService.getPostsByAuthor(authorId);
      success(res, posts);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PostController();
