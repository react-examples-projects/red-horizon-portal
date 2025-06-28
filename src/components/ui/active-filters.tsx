import React from "react";
import { Search, Filter, Calendar, X } from "lucide-react";
import { Badge } from "./badge";
import { Button } from "./button";

interface ActiveFiltersProps {
  searchTerm?: string;
  category?: string;
  dateFilter?: string;
  onClearFilters: () => void;
  onClearSearch?: () => void;
  onClearCategory?: () => void;
  onClearDateFilter?: () => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  searchTerm,
  category,
  dateFilter,
  onClearFilters,
  onClearSearch,
  onClearCategory,
  onClearDateFilter,
}) => {
  const hasActiveFilters =
    searchTerm || (category && category !== "all") || (dateFilter && dateFilter !== "all");

  if (!hasActiveFilters) return null;

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
    <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Filtros activos:</span>
        <Button
          onClick={onClearFilters}
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
        >
          <X className="h-3 w-3 mr-1" />
          Limpiar todos
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {searchTerm && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Search className="h-3 w-3" />"{searchTerm}"
            {onClearSearch && (
              <button onClick={onClearSearch} className="ml-1 hover:text-red-600 transition-colors">
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        )}

        {category && category !== "all" && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Filter className="h-3 w-3" />
            {getFilterLabel("category", category)}
            {onClearCategory && (
              <button
                onClick={onClearCategory}
                className="ml-1 hover:text-red-600 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        )}

        {dateFilter && dateFilter !== "all" && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {getFilterLabel("dateFilter", dateFilter)}
            {onClearDateFilter && (
              <button
                onClick={onClearDateFilter}
                className="ml-1 hover:text-red-600 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ActiveFilters;
