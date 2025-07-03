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
    imagesToDelete: yup
      .mixed()
      .test("is-valid-array", "Debe ser un array válido de IDs", function (value) {
        if (!value) return true; // Es opcional

        let arrayToValidate = [];

        // Si es un string, intentar parsearlo como JSON
        if (typeof value === "string") {
          try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
              arrayToValidate = parsed;
            } else {
              return false;
            }
          } catch (error) {
            return false;
          }
        }
        // Si ya es un array, usarlo directamente
        else if (Array.isArray(value)) {
          arrayToValidate = value;
        }
        // Si no es ni string ni array, es inválido
        else {
          return false;
        }

        // Validar que cada elemento sea un ObjectId válido
        return arrayToValidate.every(
          (id) => typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id)
        );
      })
      .optional(),
    documentsToDelete: yup
      .mixed()
      .test("is-valid-array", "Debe ser un array válido de IDs", function (value) {
        if (!value) return true; // Es opcional

        let arrayToValidate = [];

        // Si es un string, intentar parsearlo como JSON
        if (typeof value === "string") {
          try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
              arrayToValidate = parsed;
            } else {
              return false;
            }
          } catch (error) {
            return false;
          }
        }
        // Si ya es un array, usarlo directamente
        else if (Array.isArray(value)) {
          arrayToValidate = value;
        }
        // Si no es ni string ni array, es inválido
        else {
          return false;
        }

        // Validar que cada elemento sea un ObjectId válido
        return arrayToValidate.every(
          (id) => typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id)
        );
      })
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

// Validaciones para HomeContent
const homeContentSchemaValidation = yup.object({
  body: yup.object({
    hero: yup
      .object({
        title: yup
          .string()
          .min(1, "El título del hero debe tener mínimo 1 carácter")
          .max(200, "El título del hero debe tener máximo 200 caracteres")
          .required("El título del hero es obligatorio"),
        subtitle: yup
          .string()
          .min(1, "El subtítulo del hero debe tener mínimo 1 carácter")
          .max(200, "El subtítulo del hero debe tener máximo 200 caracteres")
          .required("El subtítulo del hero es obligatorio"),
        description: yup
          .string()
          .min(10, "La descripción del hero debe tener mínimo 10 caracteres")
          .max(1000, "La descripción del hero debe tener máximo 1000 caracteres")
          .required("La descripción del hero es obligatoria"),
        primaryButtonText: yup
          .string()
          .min(1, "El texto del botón principal debe tener mínimo 1 carácter")
          .max(50, "El texto del botón principal debe tener máximo 50 caracteres")
          .required("El texto del botón principal es obligatorio"),
        secondaryButtonText: yup
          .string()
          .min(1, "El texto del botón secundario debe tener mínimo 1 carácter")
          .max(50, "El texto del botón secundario debe tener máximo 50 caracteres")
          .required("El texto del botón secundario es obligatorio"),
      })
      .required("La sección hero es obligatoria"),
    features: yup
      .object({
        title: yup
          .string()
          .min(1, "El título de las características debe tener mínimo 1 carácter")
          .max(200, "El título de las características debe tener máximo 200 caracteres")
          .required("El título de las características es obligatorio"),
        description: yup
          .string()
          .min(10, "La descripción de las características debe tener mínimo 10 caracteres")
          .max(1000, "La descripción de las características debe tener máximo 1000 caracteres")
          .required("La descripción de las características es obligatoria"),
        cards: yup
          .array()
          .of(
            yup.object({
              id: yup.string().required("El ID de la tarjeta es obligatorio"),
              title: yup
                .string()
                .min(1, "El título de la tarjeta debe tener mínimo 1 carácter")
                .max(100, "El título de la tarjeta debe tener máximo 100 caracteres")
                .required("El título de la tarjeta es obligatorio"),
              description: yup
                .string()
                .min(10, "La descripción de la tarjeta debe tener mínimo 10 caracteres")
                .max(500, "La descripción de la tarjeta debe tener máximo 500 caracteres")
                .required("La descripción de la tarjeta es obligatoria"),
              icon: yup
                .string()
                .min(1, "El icono de la tarjeta debe tener mínimo 1 carácter")
                .max(50, "El icono de la tarjeta debe tener máximo 50 caracteres")
                .required("El icono de la tarjeta es obligatorio"),
            })
          )
          .min(1, "Debe haber al menos una tarjeta de características")
          .required("Las tarjetas de características son obligatorias"),
      })
      .required("La sección features es obligatoria"),
    downloads: yup
      .object({
        title: yup
          .string()
          .min(1, "El título de las descargas debe tener mínimo 1 carácter")
          .max(200, "El título de las descargas debe tener máximo 200 caracteres")
          .required("El título de las descargas es obligatorio"),
        description: yup
          .string()
          .min(10, "La descripción de las descargas debe tener mínimo 10 caracteres")
          .max(1000, "La descripción de las descargas debe tener máximo 1000 caracteres")
          .required("La descripción de las descargas es obligatoria"),
        items: yup
          .array()
          .of(
            yup.object({
              id: yup.string().required("El ID del elemento es obligatorio"),
              title: yup
                .string()
                .min(1, "El título del elemento debe tener mínimo 1 carácter")
                .max(100, "El título del elemento debe tener máximo 100 caracteres")
                .required("El título del elemento es obligatorio"),
              description: yup
                .string()
                .min(10, "La descripción del elemento debe tener mínimo 10 caracteres")
                .max(300, "La descripción del elemento debe tener máximo 300 caracteres")
                .required("La descripción del elemento es obligatoria"),
              type: yup
                .string()
                .oneOf(["pdf", "word", "excel", "link"], "El tipo debe ser pdf, word, excel o link")
                .required("El tipo del elemento es obligatorio"),
              url: yup
                .string()
                .min(1, "La URL del elemento debe tener mínimo 1 carácter")
                .max(500, "La URL del elemento debe tener máximo 500 caracteres")
                .required("La URL del elemento es obligatoria"),
              size: yup.string().max(20, "El tamaño debe tener máximo 20 caracteres").optional(),
            })
          )
          .min(1, "Debe haber al menos un elemento descargable")
          .required("Los elementos descargables son obligatorios"),
      })
      .required("La sección downloads es obligatoria"),
    info: yup
      .object({
        title: yup
          .string()
          .min(1, "El título de la información debe tener mínimo 1 carácter")
          .max(200, "El título de la información debe tener máximo 200 caracteres")
          .required("El título de la información es obligatorio"),
        description: yup
          .string()
          .max(1000, "La descripción de la información debe tener máximo 1000 caracteres")
          .optional(),
        sections: yup
          .array()
          .of(
            yup.object({
              id: yup.string().required("El ID de la sección es obligatorio"),
              title: yup
                .string()
                .min(1, "El título de la sección debe tener mínimo 1 carácter")
                .max(100, "El título de la sección debe tener máximo 100 caracteres")
                .required("El título de la sección es obligatorio"),
              description: yup
                .string()
                .min(10, "La descripción de la sección debe tener mínimo 10 caracteres")
                .max(500, "La descripción de la sección debe tener máximo 500 caracteres")
                .required("La descripción de la sección es obligatoria"),
              icon: yup
                .string()
                .min(1, "El icono de la sección debe tener mínimo 1 carácter")
                .max(50, "El icono de la sección debe tener máximo 50 caracteres")
                .required("El icono de la sección es obligatorio"),
            })
          )
          .min(1, "Debe haber al menos una sección de información")
          .required("Las secciones de información son obligatorias"),
      })
      .required("La sección info es obligatoria"),
    gallery: yup
      .object({
        title: yup
          .string()
          .min(1, "El título de la galería debe tener mínimo 1 carácter")
          .max(200, "El título de la galería debe tener máximo 200 caracteres")
          .required("El título de la galería es obligatorio"),
        description: yup
          .string()
          .min(10, "La descripción de la galería debe tener mínimo 10 caracteres")
          .max(1000, "La descripción de la galería debe tener máximo 1000 caracteres")
          .required("La descripción de la galería es obligatoria"),
        images: yup
          .array()
          .of(
            yup.object({
              id: yup.string().required("El ID de la imagen es obligatorio"),
              url: yup
                .string()
                .min(1, "La URL de la imagen debe tener mínimo 1 carácter")
                .max(500, "La URL de la imagen debe tener máximo 500 caracteres")
                .required("La URL de la imagen es obligatoria"),
              title: yup
                .string()
                .min(1, "El título de la imagen debe tener mínimo 1 carácter")
                .max(100, "El título de la imagen debe tener máximo 100 caracteres")
                .required("El título de la imagen es obligatorio"),
              description: yup
                .string()
                .min(10, "La descripción de la imagen debe tener mínimo 10 caracteres")
                .max(300, "La descripción de la imagen debe tener máximo 300 caracteres")
                .required("La descripción de la imagen es obligatoria"),
            })
          )
          .min(1, "Debe haber al menos una imagen en la galería")
          .required("Las imágenes de la galería son obligatorias"),
      })
      .required("La sección gallery es obligatoria"),
  }),
});

const homeContentIdValidation = yup.object({
  params: yup.object({
    contentId: idSchema,
  }),
});

const homeContentHistoryValidation = yup.object({
  query: yup.object({
    limit: yup
      .number()
      .min(1, "El límite debe ser mínimo 1")
      .max(50, "El límite debe ser máximo 50")
      .optional(),
    page: yup.number().min(1, "La página debe ser mínimo 1").optional(),
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
  // Validaciones para HomeContent
  homeContentSchemaValidation,
  homeContentIdValidation,
  homeContentHistoryValidation,
};
