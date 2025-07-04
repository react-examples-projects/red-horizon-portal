const express = require("express");
const router = express.Router();
const {
  getHomeContent,
  getAdminHomeContent,
  createOrUpdateHomeContent,
  uploadDownloadFile,
  uploadGalleryImageFile,
  uploadInfoMainImage,
  getHomeContentHistory,
  restoreHomeContent,
  deleteHomeContent,
  getHomeContentStats,
} = require("../../controllers/homeContentController");
const existsToken = require("../../middlewares/existsToken");
const validate = require("../../helpers/validations/validate");
const {
  homeContentSchemaValidation,
  homeContentIdValidation,
  homeContentHistoryValidation,
} = require("../../helpers/validations/validations");

// Rutas públicas (sin autenticación)
router.get("/content", getHomeContent);

// Rutas privadas (requieren autenticación)
router.get("/admin", existsToken, getAdminHomeContent);
router.post(
  "/admin",
  existsToken,
  createOrUpdateHomeContent // Removido validate temporalmente para permitir archivos
);
router.put(
  "/content",
  existsToken,
  createOrUpdateHomeContent // Removido validate temporalmente para permitir archivos
);

// Rutas para subida de archivos individuales
router.post("/admin/upload-download", existsToken, uploadDownloadFile);

router.post("/admin/upload-gallery", existsToken, uploadGalleryImageFile);

router.post("/admin/upload-info-main-image", existsToken, uploadInfoMainImage);

router.get(
  "/admin/history",
  existsToken,
  validate(homeContentHistoryValidation),
  getHomeContentHistory
);
router.post(
  "/admin/restore/:contentId",
  existsToken,
  validate(homeContentIdValidation),
  restoreHomeContent
);
router.delete(
  "/admin/:contentId",
  existsToken,
  validate(homeContentIdValidation),
  deleteHomeContent
);
router.get("/admin/stats", existsToken, getHomeContentStats);

module.exports = router;
