import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import useSession from "@/hooks/useSession";
import { useGetInfinitePosts, useDeletePost } from "@/hooks/usePosts";
import HtmlContent from "@/components/ui/html-content";
import NoResults from "@/components/ui/no-results";
import SearchHelp from "@/components/ui/search-help";
import ActiveFilters from "@/components/ui/active-filters";
import { createTextPreview } from "@/lib/utils";

import { Publication } from "@/types/Publication";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  FileText,
  Users,
  Calendar,
  TrendingUp,
  Search,
  Filter,
  Loader2,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { user } = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDateFilter, setSelectedDateFilter] = useState("all");

  // Hooks de React Query
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error, refetch } =
    useGetInfinitePosts({
      limit: 10,
      category: selectedCategory !== "all" ? selectedCategory : undefined,
      search: searchTerm || undefined,
      dateFilter: selectedDateFilter !== "all" ? selectedDateFilter : undefined,
    });

  const deletePostMutation = useDeletePost();

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

  // Debug: Log para verificar la estructura de datos
  console.log("Data structure:", data);
  console.log("All publications:", allPublications);
  console.log("Has next page:", hasNextPage);
  console.log("Is fetching next page:", isFetchingNextPage);

  // Debug adicional para paginación
  if (data?.pages) {
    console.log(
      "Pages structure:",
      data.pages.map((page, index) => ({
        pageIndex: index,
        postsCount: page.posts?.length || 0,
        pagination: page.pagination,
        hasNextPage: page.pagination?.hasNextPage,
      }))
    );
  }

  const handleDeletePublication = async (id: string) => {
    try {
      await deletePostMutation.mutateAsync(id);
      toast({
        title: "Publicación eliminada",
        description: "La publicación ha sido eliminada exitosamente",
      });
    } catch (error) {
      console.error("Error al eliminar la publicación:", error);
      toast({
        title: "Error",
        description: "Hubo un error al eliminar la publicación. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

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

  const handleCreateNew = () => {
    navigate("/admin/crear-publicacion");
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
            <FileText className="h-12 w-12 text-red-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error al cargar las publicaciones
            </h3>
            <p className="text-gray-600 mb-4">Hubo un problema al obtener tus publicaciones</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel Administrativo</h1>
          <p className="text-gray-600">
            Bienvenido, {user?.email} - Gestiona el contenido de la comunidad
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">
                Total Publicaciones
              </CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : allPublications.length}
              </div>
              <p className="text-xs text-blue-600">Tus publicaciones</p>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">
                Usuarios Registrados
              </CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">248</div>
              <p className="text-xs text-green-600">+12 este mes</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">
                Eventos Programados
              </CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">5</div>
              <p className="text-xs text-purple-600">próximos 30 días</p>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Visualizaciones</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">1,234</div>
              <p className="text-xs text-red-600">+18% vs mes anterior</p>
            </CardContent>
          </Card>
        </div>

        {/* Publications Management */}
        <Card className="border-red-100">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-red-700">Gestión de Publicaciones</CardTitle>
                <CardDescription>Administra las publicaciones de la comunidad</CardDescription>
              </div>
              <Link to="/admin/crear-publicacion">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Publicación
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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

              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 border-red-200 focus:ring-red-500 focus:border-red-500">
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
                  <SelectTrigger className="w-44 border-red-200 focus:ring-red-500 focus:border-red-500">
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

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-red-600 mx-auto mb-4" />
                <p className="text-gray-600">Cargando publicaciones...</p>
              </div>
            )}

            {/* Publications List */}
            {!isLoading && (
              <div className="space-y-4">
                {allPublications.length > 0 ? (
                  allPublications.map((publication, index) => {
                    const isLast = index === allPublications.length - 1;
                    return (
                      <div
                        key={publication._id}
                        ref={isLast ? lastElementRef : undefined}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{publication.title}</h3>
                            <Badge className={getCategoryColor(publication.category)}>
                              {getCategoryLabel(publication.category)}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            <HtmlContent
                              content={createTextPreview(publication.description, 120)}
                              className="line-clamp-2"
                            />
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Por: {publication.author.name}</span>
                            <span>Creado: {formatDate(publication.createdAt)}</span>
                            <span>Actualizado: {formatDate(publication.updatedAt)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-200 text-blue-600 hover:bg-blue-50"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Link to={`/admin/editar-publicacion/${publication._id}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-200 text-green-600 hover:bg-green-50"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeletePublication(publication._id)}
                            disabled={deletePostMutation.isPending}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            {deletePostMutation.isPending ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <NoResults
                    searchTerm={searchTerm}
                    category={selectedCategory}
                    dateFilter={selectedDateFilter}
                    onClearFilters={handleClearFilters}
                    onCreateNew={handleCreateNew}
                  />
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
