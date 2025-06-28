const chalk = require("chalk");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { SERVER } = require("../config/variables");
const message = {
  success(str) {
    console.log(chalk.greenBright(`[✔️] ${str}`) + "\n");
  },

  error(str, err = null) {
    console.error(chalk.redBright(`[❌] ${str}`) + "\n");
    err && console.error(chalk.redBright(`[❌] Error message: ${err}`) + "\n");
  },

  warn(str) {
    console.warn(chalk.yellowBright(`[⚠️] ${str}`) + "\n");
  },
};

function getTokenInfo(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SERVER.API.SECRET_TOKEN, (err, payload) => {
      if (err) return reject(new Error(err));
      resolve(payload);
    });
  });
}

function hashPassword(password) {
  const salt = bcrypt.genSaltSync(parseInt(SERVER.API.SALT_BCRYPT));
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

function isInvalidPassword(hashedPassword, password) {
  const result = bcrypt.compareSync(hashedPassword, password);
  return !result;
}

function getTokenFromPayload(payload) {
  const token = jwt.sign(payload, SERVER.API.SECRET_TOKEN, {
    expiresIn: "1h",
  });
  return token;
}
  
function isRequestAjaxOrApi(req) {
  return !req.accepts("html") || req.xhr;
}

function formatRoutes(routes) {
  // Calculamos el ancho máximo de cada columna
  const methodColWidth = Math.max(
    ...routes.map((r) => r.methods.join(", ").length),
    "METHODS".length
  );
  const pathColWidth = Math.max(...routes.map((r) => r.path.length), "PATH".length);
  const middlewareColWidth = Math.max(
    ...routes.map((r) => r.middlewares.join(", ").length),
    "MIDDLEWARES".length
  );

  // Encabezado
  const header =
    padRight("METHODS", methodColWidth) +
    " | " +
    padRight("PATH", pathColWidth) +
    " | " +
    padRight("MIDDLEWARES", middlewareColWidth);
  const separator = "-".repeat(header.length);

  console.log(header);
  console.log(separator);

  // Filas
  for (const route of routes) {
    const methods = padRight(route.methods.join(", "), methodColWidth);
    const path = padRight(route.path, pathColWidth);
    const middlewares = padRight(route.middlewares.join(", "), middlewareColWidth);
    console.log(`${methods} | ${path} | ${middlewares}`);
  }

  // Función auxiliar
  function padRight(text, width) {
    return text + " ".repeat(width - text.length);
  }
}



module.exports = {
  message,
  getTokenInfo,
  hashPassword,
  isInvalidPassword,
  isRequestAjaxOrApi,
  getTokenFromPayload,
  formatRoutes,
};
