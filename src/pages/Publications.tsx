import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { PublicationCard } from "@/components/PublicationCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetInfinitePosts } from "@/hooks/usePosts";
import { Search, Filter, Loader2 } from "lucide-react";
import { useCallback, useRef } from "react";
import { Publication } from "@/types/Publication";

const Publications = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDateFilter, setSelectedDateFilter] = useState("all");

  // Hooks de React Query
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error, refetch } =
    useGetInfinitePosts({
      limit: 9, // 3 columnas x 3 filas
      category: selectedCategory !== "all" ? selectedCategory : undefined,
      search: searchTerm || undefined,
      dateFilter: selectedDateFilter !== "all" ? selectedDateFilter : undefined,
    });

  // Observer para infinite scroll
  const observer = useRef<IntersectionObserver>();
  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          console.log("Loading next page...");
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  // Obtener todas las publicaciones de todas las páginas
  const allPublications = data?.pages.flatMap((page) => page.posts) || [];

  const categories = [
    { value: "all", label: "Todas las categorías" },
    { value: "general", label: "General" },
    { value: "mantenimiento", label: "Mantenimiento" },
    { value: "seguridad", label: "Seguridad" },
    { value: "eventos", label: "Eventos" },
    { value: "avisos", label: "Avisos" },
  ];

  const dateFilters = [
    { value: "all", label: "Todas las fechas" },
    { value: "today", label: "Hoy" },
    { value: "week", label: "Última semana" },
    { value: "month", label: "Último mes" },
  ];

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedDateFilter("all");
  };

  const handleViewPublication = (publication: Publication) => {
    navigate(`/admin/publicacion/${publication._id}`);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-8">
            <Search className="h-12 w-12 text-red-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error al cargar las publicaciones
            </h3>
            <p className="text-gray-600 mb-4">Hubo un problema al obtener las publicaciones</p>
            <Button onClick={() => refetch()} className="bg-red-600 hover:bg-red-700 text-white">
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Publicaciones</h1>
          <p className="text-gray-600">
            Mantente informado sobre las últimas noticias y eventos de la comunidad
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-red-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar palabras parciales (ej: 'rob' encuentra 'robo', 'robusto'...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-red-200 focus:ring-red-500 focus:border-red-500"
                />
                {searchTerm && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      Búsqueda parcial
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 border-red-200 focus:ring-red-500 focus:border-red-500">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedDateFilter} onValueChange={setSelectedDateFilter}>
                <SelectTrigger className="w-44 border-red-200 focus:ring-red-500 focus:border-red-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dateFilters.map((filter) => (
                    <SelectItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Botón de Reset de Filtros */}
              {(searchTerm || selectedCategory !== "all" || selectedDateFilter !== "all") && (
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 whitespace-nowrap"
                >
                  Limpiar
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Mostrando {allPublications.length} publicaciones
            {selectedCategory !== "all" && (
              <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-sm rounded-full">
                {categories.find((c) => c.value === selectedCategory)?.label}
              </span>
            )}
            {selectedDateFilter !== "all" && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                {dateFilters.find((f) => f.value === selectedDateFilter)?.label}
              </span>
            )}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-red-600 mx-auto mb-4" />
            <p className="text-gray-600">Cargando publicaciones...</p>
          </div>
        )}

        {/* Publications Grid */}
        {!isLoading && (
          <>
            {allPublications.length > 0 ? (
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {allPublications.map((publication, index) => {
                  const isLast = index === allPublications.length - 1;
                  return (
                    <div
                      key={publication._id}
                      ref={isLast ? lastElementRef : undefined}
                      className="break-inside-avoid mb-6"
                    >
                      <PublicationCard publication={publication} onView={handleViewPublication} />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No se encontraron publicaciones
                  </h3>
                  <p>Intenta cambiar los filtros o términos de búsqueda</p>
                </div>
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  Limpiar filtros
                </Button>
              </div>
            )}

            {/* Loading more indicator */}
            {isFetchingNextPage && (
              <div className="text-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-red-600 mx-auto" />
                <p className="text-sm text-gray-600 mt-2">Cargando más publicaciones...</p>
              </div>
            )}

            {/* No more pages indicator */}
            {!isFetchingNextPage && !hasNextPage && allPublications.length > 0 && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No hay más publicaciones para cargar</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Publications;
