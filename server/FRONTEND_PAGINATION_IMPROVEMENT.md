# Componente de Paginación Mejorado

Este archivo muestra cómo implementar un componente de paginación mejorado que funcione correctamente con la nueva lógica del backend.

## Componente de Paginación

```jsx
// Componente de paginación mejorado
const Pagination = ({
  currentPage,
  totalPages,
  total,
  limit,
  hasNextPage,
  hasPrevPage,
  nextPage,
  prevPage,
  showing,
  onPageChange,
}) => {
  // Si no hay páginas o solo hay una página, no mostrar paginación
  if (totalPages <= 1) {
    return null;
  }

  // Calcular qué páginas mostrar
  const getVisiblePages = () => {
    const delta = 2; // Número de páginas a mostrar antes y después de la página actual
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="pagination-container">
      {/* Información de resultados mostrados */}
      <div className="pagination-info">
        <span>
          Mostrando {showing.from} a {showing.to} de {showing.total} resultados
        </span>
      </div>

      {/* Controles de paginación */}
      <div className="pagination-controls">
        {/* Botón anterior */}
        <button
          onClick={() => onPageChange(prevPage)}
          disabled={!hasPrevPage}
          className={`pagination-btn ${!hasPrevPage ? "disabled" : ""}`}
        >
          ← Anterior
        </button>

        {/* Números de página */}
        <div className="pagination-numbers">
          {visiblePages.map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span className="pagination-dots">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page)}
                  className={`pagination-btn ${page === currentPage ? "active" : ""}`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Botón siguiente */}
        <button
          onClick={() => onPageChange(nextPage)}
          disabled={!hasNextPage}
          className={`pagination-btn ${!hasNextPage ? "disabled" : ""}`}
        >
          Siguiente →
        </button>
      </div>

      {/* Información adicional */}
      <div className="pagination-details">
        <span>
          Página {currentPage} de {totalPages}
        </span>
        {totalPages > 1 && <span>• {Math.ceil(total / limit)} elementos por página</span>}
      </div>
    </div>
  );
};
```

## Hook Mejorado para Posts

```javascript
// Hook mejorado que maneja la nueva información de paginación
const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [searchInfo, setSearchInfo] = useState(null);
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
      setSearchInfo(data.data.searchInfo);

      // Mostrar mensaje de búsqueda si existe
      if (data.message) {
        console.log(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFilters = useCallback(
    (newFilters) => {
      const updatedFilters = { ...filters, ...newFilters };

      // Si cambian los filtros (excepto página), resetear a página 1
      if (newFilters.page === undefined && Object.keys(newFilters).length > 0) {
        updatedFilters.page = 1;
      }

      setFilters(updatedFilters);
      fetchPosts(updatedFilters);
    },
    [filters, fetchPosts]
  );

  const goToPage = useCallback(
    (page) => {
      if (page && page >= 1 && page <= pagination.pages) {
        updateFilters({ page });
      }
    },
    [updateFilters, pagination.pages]
  );

  const clearSearch = useCallback(() => {
    updateFilters({ search: "" });
  }, [updateFilters]);

  useEffect(() => {
    fetchPosts(filters);
  }, []);

  return {
    posts,
    loading,
    pagination,
    filters,
    searchInfo,
    updateFilters,
    goToPage,
    clearSearch,
    refetch: () => fetchPosts(filters),
  };
};
```

## Componente Principal Actualizado

```jsx
// Componente principal con paginación mejorada
const PostsList = () => {
  const { posts, loading, pagination, filters, searchInfo, updateFilters, goToPage, clearSearch } =
    usePosts();

  const handleSearchChange = (search) => {
    updateFilters({ search });
  };

  const handleCategoryChange = (category) => {
    updateFilters({ category });
  };

  const handleDateFilterChange = (dateFilter) => {
    updateFilters({ dateFilter });
  };

  const handleSpecificDateChange = (specificDate) => {
    updateFilters({ specificDate });
  };

  const handlePageChange = (page) => {
    goToPage(page);
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="posts-container">
      {/* Filtros */}
      <div className="filters-section">
        <SearchInput
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Buscar en título y descripción..."
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

        {filters.search && (
          <button onClick={clearSearch} className="btn-clear-search">
            Limpiar búsqueda
          </button>
        )}
      </div>

      {/* Información de resultados de búsqueda */}
      <SearchResultsInfo searchInfo={searchInfo} />

      {/* Lista de posts o mensaje de no resultados */}
      {posts.length > 0 ? (
        <>
          <div className="posts-list">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {/* Paginación mejorada */}
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            total={pagination.total}
            limit={pagination.limit}
            hasNextPage={pagination.hasNextPage}
            hasPrevPage={pagination.hasPrevPage}
            nextPage={pagination.nextPage}
            prevPage={pagination.prevPage}
            showing={pagination.showing}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <NoResultsCard
          searchQuery={filters.search}
          suggestions={["javascript", "react", "nodejs", "programación", "desarrollo web"]}
        />
      )}
    </div>
  );
};
```

## Estilos CSS para la Paginación

```css
/* Estilos para paginación */
.pagination-container {
  margin-top: 32px;
  padding: 24px 0;
  border-top: 1px solid #e9ecef;
}

.pagination-info {
  text-align: center;
  margin-bottom: 16px;
  color: #6c757d;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.pagination-numbers {
  display: flex;
  gap: 4px;
  align-items: center;
}

.pagination-btn {
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  background-color: white;
  color: #495057;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  min-width: 40px;
  text-align: center;
}

.pagination-btn:hover:not(.disabled) {
  background-color: #e9ecef;
  border-color: #adb5bd;
}

.pagination-btn.active {
  background-color: #007bff;
  border-color: #007bff;
  color: white;
}

.pagination-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-dots {
  padding: 8px 12px;
  color: #6c757d;
  font-weight: bold;
}

.pagination-details {
  text-align: center;
  color: #6c757d;
  font-size: 12px;
  display: flex;
  justify-content: center;
  gap: 16px;
}

/* Responsive */
@media (max-width: 768px) {
  .pagination-controls {
    flex-direction: column;
    gap: 12px;
  }

  .pagination-numbers {
    order: 2;
  }

  .pagination-btn {
    min-width: 36px;
    padding: 6px 10px;
    font-size: 13px;
  }

  .pagination-details {
    flex-direction: column;
    gap: 4px;
  }
}

/* Estados de carga */
.loading {
  text-align: center;
  padding: 48px;
  color: #6c757d;
  font-size: 16px;
}

/* Animación para transiciones de página */
.posts-list {
  transition: opacity 0.3s ease;
}

.posts-list.loading {
  opacity: 0.6;
}
```

## Funcionalidades de la Paginación Mejorada

### ✅ **Información Detallada:**

- Muestra "Mostrando X a Y de Z resultados"
- Indica página actual y total de páginas
- Información sobre elementos por página

### ✅ **Navegación Inteligente:**

- Botones "Anterior" y "Siguiente"
- Números de página con elipsis para páginas largas
- Validación de páginas válidas

### ✅ **Estados Visuales:**

- Botón activo para página actual
- Botones deshabilitados cuando no hay más páginas
- Hover effects y transiciones suaves

### ✅ **Responsive:**

- Diseño adaptable a móviles
- Controles reorganizados en pantallas pequeñas

### ✅ **Validaciones:**

- Límite máximo de 100 elementos por página
- Validación de parámetros de entrada
- Manejo de casos edge

La paginación ahora debería funcionar correctamente y mostrar todos los posts disponibles. El problema anterior probablemente se debía a la falta de validaciones en los parámetros de entrada o al cálculo incorrecto del `skip`.
