const { Schema, model } = require("mongoose");

const HomeContentSchema = new Schema(
  {
    hero: {
      title: {
        type: String,
        required: [true, "El título del hero es obligatorio"],
        trim: true,
      },
      subtitle: {
        type: String,
        required: [true, "El subtítulo del hero es obligatorio"],
        trim: true,
      },
      description: {
        type: String,
        required: [true, "La descripción del hero es obligatoria"],
        trim: true,
      },
      primaryButtonText: {
        type: String,
        required: [true, "El texto del botón principal es obligatorio"],
        trim: true,
      },
      secondaryButtonText: {
        type: String,
        required: [true, "El texto del botón secundario es obligatorio"],
        trim: true,
      },
    },
    features: {
      title: {
        type: String,
        required: [true, "El título de las características es obligatorio"],
        trim: true,
      },
      description: {
        type: String,
        required: [true, "La descripción de las características es obligatoria"],
        trim: true,
      },
      cards: [
        {
          id: {
            type: String,
            required: true,
          },
          title: {
            type: String,
            required: [true, "El título de la tarjeta es obligatorio"],
            trim: true,
          },
          description: {
            type: String,
            required: [true, "La descripción de la tarjeta es obligatoria"],
            trim: true,
          },
          icon: {
            type: String,
            required: [true, "El icono de la tarjeta es obligatorio"],
            trim: true,
          },
        },
      ],
    },
    downloads: {
      title: {
        type: String,
        required: [true, "El título de las descargas es obligatorio"],
        trim: true,
      },
      description: {
        type: String,
        required: [true, "La descripción de las descargas es obligatoria"],
        trim: true,
      },
      items: [
        {
          id: {
            type: String,
            required: true,
          },
          title: {
            type: String,
            required: [true, "El título del elemento es obligatorio"],
            trim: true,
          },
          description: {
            type: String,
            required: [true, "La descripción del elemento es obligatoria"],
            trim: true,
          },
          type: {
            type: String,
            required: [true, "El tipo del elemento es obligatorio"],
            enum: ["pdf", "word", "excel", "link"],
          },
          url: {
            type: String,
            required: [true, "La URL del elemento es obligatoria"],
            trim: true,
          },
          size: {
            type: String,
            trim: true,
          },
        },
      ],
    },
    info: {
      title: {
        type: String,
        required: [true, "El título de la información es obligatorio"],
        trim: true,
      },
      description: {
        type: String,
        trim: true,
      },
      mainImage: {
        url: {
          type: String,
          trim: true,
        },
        title: {
          type: String,
          trim: true,
        },
        description: {
          type: String,
          trim: true,
        },
        publicId: {
          type: String,
          trim: true,
        },
      },
      sections: [
        {
          id: {
            type: String,
            required: true,
          },
          title: {
            type: String,
            required: [true, "El título de la sección es obligatorio"],
            trim: true,
          },
          description: {
            type: String,
            required: [true, "La descripción de la sección es obligatoria"],
            trim: true,
          },
          icon: {
            type: String,
            required: [true, "El icono de la sección es obligatorio"],
            trim: true,
          },
        },
      ],
    },
    gallery: {
      title: {
        type: String,
        required: [true, "El título de la galería es obligatorio"],
        trim: true,
      },
      description: {
        type: String,
        required: [true, "La descripción de la galería es obligatoria"],
        trim: true,
      },
      images: [
        {
          id: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: [true, "La URL de la imagen es obligatoria"],
            trim: true,
          },
          title: {
            type: String,
            required: [true, "El título de la imagen es obligatorio"],
            trim: true,
          },
          description: {
            type: String,
            required: [true, "La descripción de la imagen es obligatoria"],
            trim: true,
          },
        },
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Índices para mejorar el rendimiento
HomeContentSchema.index({ isActive: 1 });

module.exports = model("HomeContent", HomeContentSchema);
