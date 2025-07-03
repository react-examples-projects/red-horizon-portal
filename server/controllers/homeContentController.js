const homeContentService = require("../services/homeContentService");
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
    const contentData = req.body;
    if (
      !contentData.hero ||
      !contentData.features ||
      !contentData.downloads ||
      !contentData.info ||
      !contentData.gallery
    ) {
      return errorResponse(res, "Todos los campos del contenido son requeridos");
    }
    const savedContent = await homeContentService.createOrUpdateHomeContent(contentData);
    return success(res, savedContent);
  } catch (err) {
    console.error(err);
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

module.exports = {
  getHomeContent,
  getAdminHomeContent,
  createOrUpdateHomeContent,
  getHomeContentHistory,
  restoreHomeContent,
  deleteHomeContent,
  getHomeContentStats,
};
