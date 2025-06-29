import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar, User } from "lucide-react";
import { Publication } from "@/types/Publication";
import { Link } from "react-router-dom";
import HtmlContent from "@/components/ui/html-content";
import { createTextPreview } from "@/lib/utils";

interface PublicationCarouselProps {
  publications: Publication[];
  isLoading?: boolean;
}

const PublicationCarousel = ({ publications, isLoading }: PublicationCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(publications.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalPages) % totalPages);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (publications.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Calendar className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay publicaciones disponibles</h3>
        <p className="text-gray-600">Aún no se han publicado noticias en la comunidad.</p>
      </div>
    );
  }

  const currentPublications = publications.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  return (
    <div className="relative">
      {/* Carrusel */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {currentPublications.map((publication) => (
          <Card key={publication._id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge className={getCategoryColor(publication.category)}>
                  {getCategoryLabel(publication.category)}
                </Badge>
                <span className="text-xs text-gray-500">{formatDate(publication.createdAt)}</span>
              </div>
              <CardTitle className="text-lg line-clamp-2">
                <Link
                  to={`/post/${publication._id}`}
                  className="hover:text-red-600 transition-colors duration-200"
                >
                  {publication.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="line-clamp-3 mb-4">
                <HtmlContent
                  content={createTextPreview(publication.description, 120)}
                  className="text-sm"
                />
              </CardDescription>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{publication.author.name}</span>
                </div>
                <Link
                  to={`/post/${publication._id}`}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Leer más
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Controles del carrusel */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Indicadores de página */}
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-red-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            disabled={currentIndex === totalPages - 1}
            className="rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default PublicationCarousel;
