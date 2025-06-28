# Implementación de Búsqueda Parcial en el Backend

## Descripción

Para que la búsqueda funcione como se espera (ej: buscar "rob" encuentre "robo", "robusto", "robar"), necesitas implementar búsqueda parcial en el backend usando MongoDB.

## Implementación en el Backend

### 1. Actualizar el Controlador de Posts

En `server/controllers/postController.js`, actualiza la función que maneja la búsqueda:

```javascript
// Función para obtener posts con búsqueda parcial
const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search, author, dateFilter } = req.query;

    // Construir filtros
    const filters = {};

    // Filtro por categoría
    if (category && category !== "all") {
      filters.category = category;
    }

    // Filtro por autor
    if (author) {
      filters["author._id"] = author;
    }

    // Filtro por fecha
    if (dateFilter && dateFilter !== "all") {
      const now = new Date();
      let startDate;

      switch (dateFilter) {
        case "today":
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          startDate = null;
      }

      if (startDate) {
        filters.createdAt = { $gte: startDate };
      }
    }

    // BÚSQUEDA PARCIAL - Esta es la parte importante
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i"); // 'i' para case-insensitive
      filters.$or = [
        { title: searchRegex }, // Buscar en título
        { description: searchRegex }, // Buscar en descripción
      ];
    }

    // Calcular paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Ejecutar consulta
    const posts = await Post.find(filters)
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Contar total de documentos
    const total = await Post.countDocuments(filters);

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalPosts: total,
          hasNextPage: skip + posts.length < total,
          hasPrevPage: parseInt(page) > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error getting posts:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};
```

### 2. Explicación de la Búsqueda Parcial

La clave está en esta parte del código:

```javascript
if (search && search.trim()) {
  const searchRegex = new RegExp(search.trim(), "i");
  filters.$or = [{ title: searchRegex }, { description: searchRegex }];
}
```

#### ¿Cómo funciona?

1. **`new RegExp(search.trim(), 'i')`**: Crea una expresión regular

   - `search.trim()`: Elimina espacios en blanco
   - `'i'`: Hace la búsqueda case-insensitive (no distingue mayúsculas/minúsculas)

2. **`$or`**: Operador de MongoDB que busca en múltiples campos

   - Busca en el campo `title` O en el campo `description`

3. **Búsqueda parcial**: La expresión regular encuentra cualquier texto que contenga el término buscado

#### Ejemplos de búsqueda:

- Buscar "rob" encontrará:

  - "robo"
  - "robusto"
  - "robar"
  - "robótica"
  - "microbios"

- Buscar "mant" encontrará:
  - "mantenimiento"
  - "mantener"
  - "mantenido"
  - "mantenimiento preventivo"

### 3. Optimización con Índices (Opcional)

Para mejorar el rendimiento, puedes crear índices en MongoDB:

```javascript
// En tu modelo Post.js o en un script de migración
db.posts.createIndex({ title: "text", description: "text" });
```

O usando Mongoose:

```javascript
// En el modelo Post
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  // ... otros campos
});

// Crear índice de texto
postSchema.index({ title: "text", description: "text" });
```

### 4. Búsqueda Avanzada (Opcional)

Si quieres búsqueda más avanzada, puedes usar el operador `$text` de MongoDB:

```javascript
if (search && search.trim()) {
  filters.$text = { $search: search.trim() };

  // También puedes usar score para ordenar por relevancia
  const posts = await Post.find(filters)
    .populate("author", "name email")
    .sort({ score: { $meta: "textScore" } })
    .skip(skip)
    .limit(parseInt(limit));
}
```

## Pruebas

Para probar que funciona correctamente:

1. Crea publicaciones con títulos como:

   - "Robo en el edificio"
   - "Mantenimiento del ascensor"
   - "Seguridad en el estacionamiento"

2. Busca términos parciales:
   - "rob" → debe encontrar "Robo en el edificio"
   - "mant" → debe encontrar "Mantenimiento del ascensor"
   - "seg" → debe encontrar "Seguridad en el estacionamiento"

## Notas Importantes

- La búsqueda es case-insensitive
- Funciona con palabras parciales
- Busca tanto en título como en descripción
- Es compatible con los filtros existentes (categoría, fecha, autor)
- El rendimiento puede variar según la cantidad de datos

## Implementación en el Frontend

El frontend ya está configurado para enviar el parámetro `search` al backend. Solo necesitas asegurarte de que el backend procese correctamente este parámetro como se muestra arriba.
