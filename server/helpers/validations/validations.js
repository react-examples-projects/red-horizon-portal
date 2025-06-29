const yup = require("yup");
const passwordScheme = yup
  .string()
  .min(6, "Mínimo 6 carácteres para la contraseña")
  .max(50, "Máximo 50 carácteres para la contraseña")
  .required("La contraseña es obligatoria");

const idSchema = yup
  .string()
  .typeError("El indenficador debe ser un ObjectId")
  .required("El identificador es requerido");

const loginSchemaValidation = yup.object({
  body: yup.object({
    email: yup
      .string()
      .email("El correo debe ser válido, ejemplo: example@domain.es")
      .required("El correo es obligatorio"),
    password: yup
      .string()
      .min(6, "Mínimo 6 carácteres para la contraseña")
      .max(200, "Máximo 200 carácteres para la contraseña")
      .required("La contraseña es obligatoria"),
  }),
});

const signupSchemaValidation = yup.object({
  body: yup.object({
    name: yup
      .string()
      .min(4, "Mínimo 6 carácteres para el nombre")
      .max(100, "Máximo 100 carácteres para el nombre")
      .required("El nombre es obligatorio"),
    email: yup
      .string()
      .email("El correo debe ser válido, ejemplo: example@domain.es")
      .required("El correo es obligatorio"),
    password: yup
      .string()
      .min(6, "Mínimo 6 carácteres para la contraseña")
      .max(200, "Máximo 200 carácteres para la contraseña")
      .required("La contraseña es obligatoria"),
    passwordConfirm: passwordScheme.test(
      "passwordChangeValidation",
      "Las contraseñas no coinciden",
      function (value) {
        return this.parent.password === value;
      }
    ),
  }),
});

const perfilPhotoSchemaValidation = yup.object({
  files: yup.object({
    perfil_photo: yup
      .object({
        data: yup.string().required(),
      })
      .required("La imágen debe ser obligatoria"),
    // .test("fileSize", (file) => isFileTooLarge(file.size))
    // .test("fileType", (file) => isValidFileType(file.type)),
  }),
});

const passwordChangeValidation = yup.object({
  body: yup.object({
    password: passwordScheme,
    passwordConfirm: passwordScheme.test(
      "passwordChangeValidation",
      "Las contraseñas no coinciden",
      function (value) {
        return this.parent.password === value;
      }
    ),
  }),
});

const requireIdValidation = yup.object({
  params: yup.object({
    id: idSchema,
  }),
});

// Validaciones para Post
const createPostSchemaValidation = yup.object({
  body: yup.object({
    title: yup
      .string()
      .min(3, "El título debe tener mínimo 3 caracteres")
      .max(200, "El título debe tener máximo 200 caracteres")
      .required("El título es obligatorio"),
    category: yup
      .string()
      .min(2, "La categoría debe tener mínimo 2 caracteres")
      .max(50, "La categoría debe tener máximo 50 caracteres")
      .required("La categoría es obligatoria"),
    description: yup
      .string()
      .min(10, "La descripción debe tener mínimo 10 caracteres")
      .max(2000, "La descripción debe tener máximo 2000 caracteres")
      .required("La descripción es obligatoria"),
  }),
});

const updatePostSchemaValidation = yup.object({
  params: yup.object({
    id: idSchema,
  }),
  body: yup.object({
    title: yup
      .string()
      .min(3, "El título debe tener mínimo 3 caracteres")
      .max(200, "El título debe tener máximo 200 caracteres")
      .optional(),
    category: yup
      .string()
      .min(2, "La categoría debe tener mínimo 2 caracteres")
      .max(50, "La categoría debe tener máximo 50 caracteres")
      .optional(),
    description: yup
      .string()
      .min(10, "La descripción debe tener mínimo 10 caracteres")
      .max(2000, "La descripción debe tener máximo 2000 caracteres")
      .optional(),
  }),
});

const getPostsByCategorySchemaValidation = yup.object({
  params: yup.object({
    category: yup
      .string()
      .min(2, "La categoría debe tener mínimo 2 caracteres")
      .required("La categoría es requerida"),
  }),
});

module.exports = {
  loginSchemaValidation,
  signupSchemaValidation,
  perfilPhotoSchemaValidation,
  passwordChangeValidation,
  requireIdValidation,
  // Validaciones para Post
  createPostSchemaValidation,
  updatePostSchemaValidation,
  getPostsByCategorySchemaValidation,
};
