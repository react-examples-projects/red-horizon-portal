const express = require("express");
const router = express.Router();
const postController = require("../../controllers/postController");
const validate = require("../../helpers/validations/validate");
const existsToken = require("../../middlewares/existsToken");
const {
  createPostSchemaValidation,
  updatePostSchemaValidation,
  getPostsByCategorySchemaValidation,
  getPostsByAuthorSchemaValidation,
  requireIdValidation,
} = require("../../helpers/validations/validations");

// Rutas públicas (no requieren autenticación)
router.get("/", postController.getAllPosts);
router.get("/debug/natural-order", postController.getAllPostsNaturalOrder);
router.get(
  "/category/:category",
  validate(getPostsByCategorySchemaValidation),
  postController.getPostsByCategory
);
router.get(
  "/author/:authorId",
  validate(getPostsByAuthorSchemaValidation),
  postController.getPostsByAuthor
);
router.get("/:id", validate(requireIdValidation), postController.getPostById);

// Rutas protegidas (requieren autenticación)
router.use(existsToken);

// CRUD básico
router.post("/", validate(createPostSchemaValidation), postController.createPost);
router.patch("/:id", validate(updatePostSchemaValidation), postController.updatePost);
router.delete("/:id", validate(requireIdValidation), postController.deletePost);

// Rutas específicas del usuario autenticado
router.get("/me/posts", postController.getMyPosts);

module.exports = router;
