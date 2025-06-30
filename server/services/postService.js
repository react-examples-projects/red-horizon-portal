const { hashPassword, compareObjectIds } = require("../helpers/utils");
const { deletePostFiles } = require("../helpers/cloudinary");
const UserModel = require("../models/User");

class PostService {
  constructor() {
    this.PostModel = require("../models/Post");
    this.optionsUpdate = { new: true };
  }

  async createPost(payload) {
    const post = new this.PostModel(payload);
    return new Promise((resolve, reject) => {
      post.save((err, result) => {
        if (err) return reject(err);
        resolve(result.toObject());
      });
    });
  }

  async getAllPosts(query = {}) {
    const { page = 1, limit = 10, category, search, author, dateFilter = "all" } = query;

    // Validar y convertir parámetros de paginación
    const currentPage = Math.max(1, parseInt(page) || 1);
    const itemsPerPage = Math.max(1, Math.min(100, parseInt(limit) || 10)); // Máximo 100 items por página
    const skip = (currentPage - 1) * itemsPerPage;

    let filter = { isActive: true };

    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    // Mejorar búsqueda: buscar en título y descripción
    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: "i" };
      filter.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    if (author) {
      filter.author = author;
    }

    // Aplicar filtro de fecha
    if (dateFilter && dateFilter !== "all") {
      const now = new Date();
      let startDate, endDate;

      switch (dateFilter) {
        case "today":
          // Fecha de hoy: desde 00:00:00 hasta 23:59:59
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
          break;
        case "week":
          // Última semana: desde hace 7 días hasta hoy
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
          break;
        case "month":
          // Último mes: desde el primer día del mes actual hasta hoy
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
          break;
        default:
          // Si es una fecha específica (formato: YYYY-MM-DD)
          if (dateFilter.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const [year, month, day] = dateFilter.split("-").map(Number);
            startDate = new Date(year, month - 1, day); // month - 1 porque los meses van de 0-11
            endDate = new Date(year, month - 1, day, 23, 59, 59, 999);
          } else {
            startDate = null;
            endDate = null;
          }
      }

      if (startDate && endDate) {
        filter.createdAt = {
          $gte: startDate,
          $lte: endDate,
        };
      }
    }

    // Obtener el total de documentos que coinciden con el filtro
    const total = await this.PostModel.countDocuments(filter);

    // Calcular información de paginación
    const totalPages = Math.ceil(total / itemsPerPage);
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    // Obtener los posts con paginación - Ordenamiento consistente
    const posts = await this.PostModel.find(filter)
      .populate("author", "name email perfil_photo")
      .sort({ createdAt: -1, _id: -1 }) // Ordenar por fecha de creación (más recientes primero) y luego por _id para consistencia
      .skip(skip)
      .limit(itemsPerPage)
      .lean();

    return {
      posts,
      pagination: {
        page: currentPage,
        limit: itemsPerPage,
        total,
        pages: totalPages,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? currentPage + 1 : null,
        prevPage: hasPrevPage ? currentPage - 1 : null,
        showing: {
          from: total > 0 ? skip + 1 : 0,
          to: Math.min(skip + itemsPerPage, total),
          total,
        },
      },
      searchInfo: search
        ? {
            query: search.trim(),
            resultsFound: total,
            hasResults: total > 0,
          }
        : null,
    };
  }

  async getPostById(id) {
    const post = await this.PostModel.findById(id)
      .populate("author", "name email perfil_photo")
      .lean();

    if (!post || !post.isActive) {
      throw new Error("Publicación no encontrada");
    }

    return post;
  }

  async updatePost({ id, authorId, updateData }) {
    // Verificar que el post existe y pertenece al autor
    const existingPost = await this.PostModel.findById(id);
    if (!existingPost) {
      throw new Error("Publicación no encontrada");
    }

    if (!compareObjectIds(existingPost.author, authorId)) {
      throw new Error("No tienes permisos para editar esta publicación");
    }

    const postUpdated = await this.PostModel.findByIdAndUpdate(id, updateData, this.optionsUpdate)
      .populate("author", "name email perfil_photo")
      .lean();

    return postUpdated;
  }

  async deletePost({ id, authorId }) {
    // Verificar que el post existe y pertenece al autor
    const existingPost = await this.PostModel.findById(id);
    if (!existingPost) {
      throw new Error("Publicación no encontrada");
    }

    if (!compareObjectIds(existingPost.author, authorId)) {
      throw new Error("No tienes permisos para eliminar esta publicación");
    }

    // Eliminar archivos de Cloudinary antes de eliminar el post
    let cloudinaryResults = null;
    try {
      cloudinaryResults = await deletePostFiles(existingPost);
      console.log("Archivos eliminados de Cloudinary:", cloudinaryResults);
    } catch (error) {
      console.error("Error al eliminar archivos de Cloudinary:", error);
      // Continuar con la eliminación del post incluso si falla la eliminación de archivos
    }

    // Soft delete - marcar como inactivo en lugar de eliminar
    const postDeleted = await this.PostModel.findByIdAndUpdate(
      id,
      { isActive: false },
      this.optionsUpdate
    )
      .populate("author", "name email perfil_photo")
      .lean();

    // Agregar información sobre la eliminación de archivos a la respuesta
    const response = {
      post: postDeleted,
      cloudinaryCleanup: cloudinaryResults,
    };

    return response;
  }

  async getPostsByCategory(category) {
    const posts = await this.PostModel.find({
      category: { $regex: category, $options: "i" },
      isActive: true,
    })
      .populate("author", "name email perfil_photo")
      .sort({ createdAt: -1 })
      .lean();

    return posts;
  }

  async getStats() {
    // Total de posts activos
    const totalPosts = await this.PostModel.countDocuments({ isActive: true });
    // Total de posts creados hoy
    const startToday = new Date();
    startToday.setHours(0, 0, 0, 0);
    const endToday = new Date();
    endToday.setHours(23, 59, 59, 999);
    const postsToday = await this.PostModel.countDocuments({
      isActive: true,
      createdAt: { $gte: startToday, $lte: endToday },
    });
    // Total de usuarios registrados
    const totalUsers = await UserModel.countDocuments();
    return {
      totalPosts,
      postsToday,
      totalUsers,
    };
  }
}

module.exports = new PostService();
