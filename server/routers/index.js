const express = require("express");
const router = express.Router();
const existsToken = require("../middlewares/existsToken");

// sub-routers
const userRouters = require("./user");
const authRouters = require("./auth");
const postRouters = require("./post");
const homeRouters = require("./home");

router.use("/user", existsToken, userRouters);
router.use("/auth", authRouters);
router.use("/posts", postRouters);
router.use("/home", homeRouters);

router.get("/test", existsToken, (req, res, next) => {
  res.json({
    message: "You're logged!",
    user: req.user,
  });
});

module.exports = router;
