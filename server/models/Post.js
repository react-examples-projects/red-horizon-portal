const { Schema, model } = require("mongoose");

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "El título es obligatorio"],
      minLength: 3,
      maxLength: 200,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "La categoría es obligatoria"],
      minLength: 2,
      maxLength: 50,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      minLength: 10,
      maxLength: 2000,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (images) {
          return images.length <= 10; // Máximo 10 imágenes
        },
        message: "No se pueden subir más de 10 imágenes",
      },
    },
    documents: {
      type: [String],
      default: [],
      validate: {
        validator: function (documents) {
          return documents.length <= 5; // Máximo 5 documentos
        },
        message: "No se pueden subir más de 5 documentos",
      },
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El autor es obligatorio"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Índices para mejorar el rendimiento de las consultas
PostSchema.index({ title: "text", description: "text" });
PostSchema.index({ category: 1 });
PostSchema.index({ author: 1 });
PostSchema.index({ createdAt: -1 });

module.exports = model("Post", PostSchema);
