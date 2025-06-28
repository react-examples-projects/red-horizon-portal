const { SERVER } = require("./variables");
const wrapServerErrors = require("../middlewares/errorsHandling");
const { message, formatRoutes } = require("../helpers/utils");
const { connectDb, closeDb } = require("../config/connection");
const listEndpoints = require("express-list-endpoints");

async function startServer(app, routers) {
  try {
    console.clear();
    await connectDb();
    app.use("/api", routers);
    app.use((req, res, next) => {
      res.status(404).json({ status: 404, body: "Not Found" });
      next();
    });
    wrapServerErrors(app);

    const server = app.listen(SERVER.PORT, async () => {
      message.success(`Server has started in http://localhost:${SERVER.PORT}/`);
      formatRoutes(listEndpoints(app));
      process.on("SIGINT", () => closeDb(server));
      process.on("SIGTERM", () => closeDb(server));
    });
  } catch (err) {
    message.error("Error Ocurred while starting the server", err);
  }
}

module.exports = startServer;
