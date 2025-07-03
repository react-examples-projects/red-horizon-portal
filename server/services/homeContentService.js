const HomeContent = require("../models/HomeContent");

class HomeContentService {
  /**
   * Obtiene el contenido activo del Home
   * @returns {Promise<Object>} El contenido del Home
   */
  async getHomeContent() {
    try {
      const content = await HomeContent.findOne({ isActive: true }).sort({ createdAt: -1 });

      if (!content) {
        // Retornar contenido por defecto si no existe
        return this.getDefaultContent();
      }

      return content;
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
      // Desactivar contenido anterior
      await HomeContent.updateMany({}, { isActive: false });

      // Eliminar _id si viene del frontend
      if (contentData._id) {
        delete contentData._id;
      }

      // Crear nuevo contenido
      const newContent = new HomeContent({
        ...contentData,
        isActive: true,
      });

      const savedContent = await newContent.save();
      return savedContent;
    } catch (error) {
      throw new Error(`Error al crear/actualizar el contenido del Home: ${error.message}`);
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

  /**
   * Retorna el contenido por defecto
   * @returns {Object} Contenido por defecto
   */
  getDefaultContent() {
    return {
      hero: {
        title: "Bienvenidos a",
        subtitle: "Aldea Universitaria Base de Misiones Che Guevara",
        description:
          "La Aldea Universitaria Base de Misiones Che Guevara, ubicada en Valle de la Pascua, garantiza el acceso inclusivo a la educación universitaria, formando profesionales comprometidos con el desarrollo local, enmarcados en una ética socialista y el pensamiento bolivariano.",
        primaryButtonText: "Ver Publicaciones",
        secondaryButtonText: "Portal Administrativo",
      },
      features: {
        title: "Formación y Comunidad",
        description:
          "Nuestra Aldea Universitaria trabaja de la mano con las comunidades del sector Padre Chacín y zonas aledañas, promoviendo la organización popular y el desarrollo social.",
        cards: [
          {
            id: "1",
            title: "Servicios / Formación",
            description:
              "La Aldea Universitaria ofrece Programas Nacionales de Formación gratuitos y adaptados a las necesidades del pueblo, con enfoque social y comunitario, formando profesionales comprometidos con el desarrollo local.",
            icon: "BookCopy",
          },
          {
            id: "2",
            title: "Documentos",
            description:
              "Consulta y descarga documentos esenciales como reglamentos, planes de estudio, constancias, calendarios académicos y otros recursos necesarios para el desarrollo académico.",
            icon: "FileText",
          },
          {
            id: "3",
            title: "Comunidad",
            description:
              "La aldea mantiene una estrecha relación con las comunidades vecinas, promoviendo la participación activa en proyectos sociales, culturales y educativos que fortalecen el desarrollo colectivo.",
            icon: "Users",
          },
        ],
      },
      downloads: {
        title: "Archivos y Enlaces",
        description: "Accede a documentos importantes y enlaces útiles para residentes",
        items: [
          {
            id: "1",
            title: "Reglamento de Convivencia 2024",
            description: "Normativas actualizadas para la convivencia en la urbanización",
            type: "pdf",
            url: "/docs/reglamento-2024.pdf",
            size: "2.5 MB",
          },
          {
            id: "2",
            title: "Manual del Propietario",
            description: "Guía completa para nuevos residentes",
            type: "pdf",
            url: "/docs/manual-propietario.pdf",
            size: "1.8 MB",
          },
          {
            id: "3",
            title: "Formulario de Solicitudes",
            description: "Plantilla para solicitudes administrativas",
            type: "word",
            url: "/docs/formulario-solicitudes.docx",
            size: "125 KB",
          },
          {
            id: "4",
            title: "Registro de Visitantes",
            description: "Hoja de cálculo para control de visitas",
            type: "excel",
            url: "/docs/registro-visitantes.xlsx",
            size: "85 KB",
          },
          {
            id: "5",
            title: "Portal de Pagos Online",
            description: "Accede al sistema de pagos de administración",
            type: "link",
            url: "https://pagos.urbanizacion.com",
          },
          {
            id: "6",
            title: "Directorio de Emergencias",
            description: "Números importantes y servicios de emergencia",
            type: "link",
            url: "https://emergencias.urbanizacion.com",
          },
        ],
      },
      info: {
        title: "Información de la Urbanización",
        description: "",
        sections: [
          {
            id: "1",
            title: "Ubicación estratégica",
            description:
              "Está situada al este de Valle de la Pascua, lo que facilita el acceso a la educación para estudiantes de comunidades urbanas y rurales cercanas.",
            icon: "MapPinHouse",
          },
          {
            id: "2",
            title: "Sede educativa",
            description:
              "En esta urbanización se encuentra la sede de la Aldea Universitaria Base de Misiones Che Guevara, específicamente en la E.B.N. Williams Lara, lo que la convierte en un punto clave para la formación universitaria local.",
            icon: "BookText",
          },
          {
            id: "3",
            title: "Apoyo a la inclusión",
            description:
              "Su cercanía y accesibilidad contribuyen significativamente a la inclusión educativa y al ascenso social de los bachilleres de la zona.",
            icon: "UsersRound",
          },
        ],
      },
      gallery: {
        title: "Galería de Nuestra Urbanización",
        description:
          "La Urbanización Padre Chacín se ubica al este de Valle de la Pascua, Estado Guárico. Es una comunidad residencial que cuenta con servicios básicos, espacios deportivos y educativos.",
        images: [
          {
            id: "1",
            url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
            title: "Entrada Principal",
            description: "Vista de la entrada principal de la urbanización",
          },
          {
            id: "2",
            url: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&h=400&fit=crop",
            title: "Área de Seguridad",
            description: "Caseta de vigilancia 24/7",
          },
          {
            id: "3",
            url: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=600&h=400&fit=crop",
            title: "Jardines",
            description: "Espacios verdes y áreas de recreación",
          },
          {
            id: "4",
            url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop",
            title: "Áreas Comunes",
            description: "Salón de eventos y reuniones",
          },
          {
            id: "5",
            url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
            title: "Parque Infantil",
            description: "Área de juegos para niños",
          },
          {
            id: "6",
            url: "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=600&h=400&fit=crop",
            title: "Piscina Comunitaria",
            description: "Área de piscina y recreación acuática",
          },
        ],
      },
    };
  }
}

module.exports = new HomeContentService();
