import React from "react";
import { Search, FileText, Filter, Calendar, X } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { Badge } from "./badge";

interface NoResultsProps {
  searchTerm?: string;
  category?: string;
  dateFilter?: string;
  onClearFilters?: () => void;
  onCreateNew?: () => void;
}

export const NoResults: React.FC<NoResultsProps> = ({
  searchTerm,
  category,
  dateFilter,
  onClearFilters,
  onCreateNew,
}) => {
  const hasActiveFilters =
    searchTerm || (category && category !== "all") || (dateFilter && dateFilter !== "all");

  const getFilterLabel = (type: string, value: string) => {
    const labels: { [key: string]: { [key: string]: string } } = {
      category: {
        general: "General",
        mantenimiento: "Mantenimiento",
        seguridad: "Seguridad",
        eventos: "Eventos",
        avisos: "Avisos",
      },
      dateFilter: {
        today: "Hoy",
        week: "Última semana",
        month: "Último mes",
      },
    };
    return labels[type]?.[value] || value;
  };

  return (
    <Card className="border-gray-200 bg-gray-50">
      <CardContent className="text-center py-12">
        <div className="flex flex-col items-center space-y-4">
          {/* Icono principal */}
          <div className="relative">
            <Search className="h-16 w-16 text-gray-300" />
          </div>

          {/* Título */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {hasActiveFilters ? "No se encontraron publicaciones" : "No hay publicaciones"}
            </h3>

            {/* Descripción */}
            <p className="text-gray-600 max-w-md">
              {hasActiveFilters ? (
                <>
                  No se encontraron publicaciones que coincidan con{" "}
                  <span className="font-medium">
                    {getFilterLabel("category", category) ||
                      getFilterLabel("dateFilter", dateFilter)}
                  </span>
                  .
                </>
              ) : (
                "Aún no se han creado publicaciones en el sistema."
              )}
            </p>
          </div>

          {/* Filtros activos */}
          {hasActiveFilters && (
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-3">Filtros activos:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {searchTerm && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Search className="h-3 w-3" />
                    Búsqueda: "{searchTerm}"
                  </Badge>
                )}
                {category && category !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Filter className="h-3 w-3" />
                    {getFilterLabel("category", category)}
                  </Badge>
                )}
                {dateFilter && dateFilter !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {getFilterLabel("dateFilter", dateFilter)}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Acciones */}
          <div className="flex gap-3 pt-4">
            {hasActiveFilters && onClearFilters && (
              <Button
                variant="outline"
                onClick={onClearFilters}
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                <X className="h-4 w-4 mr-2" />
                Limpiar Filtros
              </Button>
            )}

            {onCreateNew && (
              <Button onClick={onCreateNew} className="bg-red-600 hover:bg-red-700 text-white">
                <FileText className="h-4 w-4 mr-2" />
                Crear Nueva Publicación
              </Button>
            )}
          </div>

          {/* Sugerencias */}
          {hasActiveFilters && (
            <div className="text-sm text-gray-500 mt-4 max-w-md">
              <p>Sugerencias:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Verifica la ortografía de las palabras clave</li>
                <li>Intenta con términos más cortos o generales</li>
                <li>Reduce el número de filtros aplicados</li>
                <li>Busca en diferentes categorías</li>
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NoResults;
