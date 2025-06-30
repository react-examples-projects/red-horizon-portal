# Ejemplo de Implementación del Filtro de Fecha en Frontend

Este archivo muestra cómo implementar el filtro de fecha en el frontend para consumir la API de posts.

## Configuración de Filtros

```javascript
// Configuración de filtros de fecha
const dateFilters = [
  { value: "all", label: "Todas las fechas" },
  { value: "today", label: "Hoy" },
  { value: "week", label: "Última semana" },
  { value: "month", label: "Último mes" },
];

// Estado para los filtros
const [filters, setFilters] = useState({
  page: 1,
  limit: 10,
  category: "",
  search: "",
  author: "",
  dateFilter: "all",
  specificDate: "", // Para fecha específica
});
```

## Componente de Filtro

```jsx
// Componente de filtro de fecha
const DateFilter = ({ value, onChange, specificDate, onSpecificDateChange }) => {
  const [showSpecificDate, setShowSpecificDate] = useState(false);

  const handleFilterChange = (newValue) => {
    if (newValue === "specific") {
      setShowSpecificDate(true);
      onChange("specific");
    } else {
      setShowSpecificDate(false);
      onChange(newValue);
    }
  };

  return (
    <div className="date-filter-container">
      <select
        value={value}
        onChange={(e) => handleFilterChange(e.target.value)}
        className="date-filter-select"
      >
        {dateFilters.map((filter) => (
          <option key={filter.value} value={filter.value}>
            {filter.label}
          </option>
        ))}
        <option value="specific">Fecha específica</option>
      </select>

      {showSpecificDate && (
        <input
          type="date"
          value={specificDate}
          onChange={(e) => onSpecificDateChange(e.target.value)}
          className="specific-date-input"
        />
      )}
    </div>
  );
};
```

## Función para Obtener Posts

```javascript
// Función para obtener posts con filtros
const fetchPosts = async (filters) => {
  try {
    const queryParams = new URLSearchParams();

    // Agregar parámetros de filtro
    if (filters.page) queryParams.append("page", filters.page);
    if (filters.limit) queryParams.append("limit", filters.limit);
    if (filters.category) queryParams.append("category", filters.category);
    if (filters.search) queryParams.append("search", filters.search);
    if (filters.author) queryParams.append("author", filters.author);

    // Manejar filtro de fecha
    if (filters.dateFilter && filters.dateFilter !== "all") {
      if (filters.dateFilter === "specific" && filters.specificDate) {
        // Usar fecha específica en formato YYYY-MM-DD
        queryParams.append("dateFilter", filters.specificDate);
      } else if (filters.dateFilter !== "specific") {
        // Usar filtros predefinidos
        queryParams.append("dateFilter", filters.dateFilter);
      }
    }

    const response = await fetch(`/api/posts?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};
```

## Hook Personalizado

```javascript
// Hook personalizado para manejar posts
const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    category: "",
    search: "",
    author: "",
    dateFilter: "all",
    specificDate: "",
  });

  const fetchPosts = useCallback(async (currentFilters) => {
    setLoading(true);
    try {
      const data = await fetchPosts(currentFilters);
      setPosts(data.data.posts);
      setPagination(data.data.pagination);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFilters = useCallback(
    (newFilters) => {
      const updatedFilters = { ...filters, ...newFilters, page: 1 }; // Reset page when filters change
      setFilters(updatedFilters);
      fetchPosts(updatedFilters);
    },
    [filters, fetchPosts]
  );

  useEffect(() => {
    fetchPosts(filters);
  }, []);

  return {
    posts,
    loading,
    pagination,
    filters,
    updateFilters,
    refetch: () => fetchPosts(filters),
  };
};
```

## Componente Principal

```jsx
// Componente principal de lista de posts
const PostsList = () => {
  const { posts, loading, pagination, filters, updateFilters } = usePosts();

  const handleDateFilterChange = (dateFilter) => {
    updateFilters({ dateFilter });
  };

  const handleSpecificDateChange = (specificDate) => {
    updateFilters({ specificDate });
  };

  const handleCategoryChange = (category) => {
    updateFilters({ category });
  };

  const handleSearchChange = (search) => {
    updateFilters({ search });
  };

  const handlePageChange = (page) => {
    updateFilters({ page });
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="posts-container">
      {/* Filtros */}
      <div className="filters-section">
        <input
          type="text"
          placeholder="Buscar posts..."
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
        />

        <select value={filters.category} onChange={(e) => handleCategoryChange(e.target.value)}>
          <option value="">Todas las categorías</option>
          <option value="tecnologia">Tecnología</option>
          <option value="deportes">Deportes</option>
          <option value="entretenimiento">Entretenimiento</option>
        </select>

        <DateFilter
          value={filters.dateFilter}
          onChange={handleDateFilterChange}
          specificDate={filters.specificDate}
          onSpecificDateChange={handleSpecificDateChange}
        />
      </div>

      {/* Lista de posts */}
      <div className="posts-list">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>

      {/* Paginación */}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.pages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
```

## Ejemplos de URLs Generadas

```javascript
// Ejemplos de cómo se construyen las URLs con diferentes filtros

// Todas las fechas (sin filtro)
/api/posts

// Filtro por fecha: hoy
/api/posts?dateFilter=today

// Filtro por fecha: última semana
/api/posts?dateFilter=week

// Filtro por fecha: último mes
/api/posts?dateFilter=month

// Fecha específica
/api/posts?dateFilter=2023-09-15

// Combinación de filtros
/api/posts?category=tecnologia&dateFilter=2023-09-15&search=javascript&page=1&limit=10

// Sin filtro de fecha (todas las fechas)
/api/posts?category=tecnologia&search=javascript
```

## Consideraciones

1. **Reset de página**: Cuando cambias los filtros, la página se resetea a 1
2. **Filtro por defecto**: Si no se especifica `dateFilter`, se usa `"all"`
3. **Combinación de filtros**: Puedes combinar el filtro de fecha con otros filtros
4. **Paginación**: El filtro de fecha funciona correctamente con la paginación
5. **Caching**: Considera implementar caching para mejorar el rendimiento
6. **Fecha específica**: El input de fecha específica solo aparece cuando se selecciona "Fecha específica"

## Validación en Frontend

```javascript
// Validación de filtros de fecha
const isValidDateFilter = (dateFilter) => {
  const validFilters = ["all", "today", "week", "month", "specific"];
  return validFilters.includes(dateFilter);
};

// Validación de fecha específica
const isValidSpecificDate = (date) => {
  if (!date) return false;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(date);
};

// Uso en el componente
const handleDateFilterChange = (dateFilter) => {
  if (isValidDateFilter(dateFilter)) {
    updateFilters({ dateFilter });
  } else {
    console.warn("Filtro de fecha inválido:", dateFilter);
  }
};

const handleSpecificDateChange = (specificDate) => {
  if (isValidSpecificDate(specificDate)) {
    updateFilters({ specificDate });
  } else {
    console.warn("Fecha específica inválida:", specificDate);
  }
};
```

## Estilos CSS (Opcional)

```css
.date-filter-container {
  display: flex;
  gap: 10px;
  align-items: center;
}

.date-filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
}

.specific-date-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
}

.filters-section {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
```
