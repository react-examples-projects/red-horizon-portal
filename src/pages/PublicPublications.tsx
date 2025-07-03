import { useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetInfinitePosts } from "@/hooks/usePosts";
import HtmlContent from "@/components/ui/html-content";
import NoResults from "@/components/ui/no-results";
import SearchHelp from "@/components/ui/search-help";
import ActiveFilters from "@/components/ui/active-filters";
import { createTextPreview } from "@/lib/utils";
import { Search, Filter, Calendar, User, Loader2, X, ArrowLeft } from "lucide-react";
import { PublicPostCard } from "@/components/PublicPostCard";

const PublicPublications = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDateFilter, setSelectedDateFilter] = useState("all");

  // Hook para obtener posts con infinite scroll
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
    useGetInfinitePosts({
      limit: 12,
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
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  // Obtener todas las publicaciones de todas las páginas
  const allPublications = data?.pages.flatMap((page) => page.posts) || [];

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedDateFilter("all");
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleClearCategory = () => {
    setSelectedCategory("all");
  };

  const handleClearDateFilter = () => {
    setSelectedDateFilter("all");
  };

  const handleExampleClick = (example: string) => {
    setSearchTerm(example);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      general: "bg-blue-100 text-blue-700",
      mantenimiento: "bg-green-100 text-green-700",
      seguridad: "bg-red-100 text-red-700",
      eventos: "bg-purple-100 text-purple-700",
      avisos: "bg-orange-100 text-orange-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      general: "General",
      mantenimiento: "Mantenimiento",
      seguridad: "Seguridad",
      eventos: "Eventos",
      avisos: "Avisos",
    };
    return labels[category] || category;
  };

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-8">
            <div className="text-red-300 mb-4">
              <Calendar className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error al cargar las publicaciones
            </h3>
            <p className="text-gray-600 mb-4">Hubo un problema al obtener las publicaciones</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
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
          <div className="flex items-center gap-4 mb-4">
            <Link to="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver al inicio
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Publicaciones de la Comunidad</h1>
          <p className="text-gray-600">
            Explora todas las noticias y anuncios de nuestra comunidad
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Buscar y Filtrar</CardTitle>
            <CardDescription>Encuentra las publicaciones que te interesan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar palabras parciales (ej: 'rob' encuentra 'robo', 'robusto'...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                {searchTerm && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      Búsqueda parcial
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedDateFilter} onValueChange={setSelectedDateFilter}>
                  <SelectTrigger className="w-44">
                    <Calendar className="h-4 w-4 mr-2" />
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
                    <X className="h-4 w-4 mr-1" />
                    Limpiar
                  </Button>
                )}
              </div>
            </div>

            {/* Search Help */}
            <div className="mb-4">
              <SearchHelp onExampleClick={handleExampleClick} />
            </div>

            {/* Active Filters Summary */}
            <ActiveFilters
              searchTerm={searchTerm}
              category={selectedCategory}
              dateFilter={selectedDateFilter}
              onClearFilters={handleClearFilters}
              onClearSearch={handleClearSearch}
              onClearCategory={handleClearCategory}
              onClearDateFilter={handleClearDateFilter}
            />
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
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
                      <PublicPostCard post={publication} />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="col-span-full">
                <NoResults
                  searchTerm={searchTerm}
                  category={selectedCategory}
                  dateFilter={selectedDateFilter}
                  onClearFilters={handleClearFilters}
                />
              </div>
            )}
          </>
        )}

        {/* Loading more indicator */}
        {isFetchingNextPage && (
          <div className="text-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-red-600 mx-auto" />
            <p className="text-sm text-gray-600 mt-2">Cargando más publicaciones...</p>
          </div>
        )}

        {/* No more pages indicator */}
        {!isFetchingNextPage && !hasNextPage && allPublications.length > 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No hay más publicaciones para cargar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicPublications;
