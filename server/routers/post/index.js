const express = require("express");
const router = express.Router();
const postController = require("../../controllers/postController");
const validate = require("../../helpers/validations/validate");
const existsToken = require("../../middlewares/existsToken");
const {
  createPostSchemaValidation,
  updatePostSchemaValidation,
  getPostsByCategorySchemaValidation,
  requireIdValidation,
} = require("../../helpers/validations/validations");

// Rutas públicas (no requieren autenticación)
router.get("/", postController.getAllPosts);
router.get(
  "/category/:category",
  validate(getPostsByCategorySchemaValidation),
  postController.getPostsByCategory
);
router.get("/:id", validate(requireIdValidation), postController.getPostById);

// Ruta específica para posts públicos (más descriptiva)
router.get("/public/:id", validate(requireIdValidation), postController.getPublicPost);

// Rutas protegidas (requieren autenticación)
router.use(existsToken);

// CRUD básico
router.post("/", validate(createPostSchemaValidation), postController.createPost);
router.patch("/:id", validate(updatePostSchemaValidation), postController.updatePost);
router.delete("/:id", validate(requireIdValidation), postController.deletePost);

module.exports = router;
