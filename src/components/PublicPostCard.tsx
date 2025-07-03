import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Eye,
  Calendar,
  User,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";
import { Publication } from "@/types/Publication";
import { Link } from "react-router-dom";

interface PublicPostCardProps {
  post: Publication;
}

export const PublicPostCard = ({ post }: PublicPostCardProps) => {
  const handleDownload = (fileUrl: string, filename: string, e: React.MouseEvent) => {
    // Prevenir que el click se propague a la card
    e.stopPropagation();

    // Crear un enlace temporal para descargar el archivo
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
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

  // Función para limpiar HTML y obtener texto plano
  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Limpiar la descripción de HTML
  const cleanDescription = stripHtml(post.description);

  // Verificar si hay contenido multimedia
  const hasImages = post.images && post.images.length > 0;
  const hasDocuments = post.documents && post.documents.length > 0;
  const hasMultimedia = hasImages || hasDocuments;

  return (
    <Link to={`/post/${post._id}`} className="block">
      <Card className="hover:shadow-lg transition-all duration-300 border-red-100 hover:border-red-200 cursor-pointer hover:scale-[1.02] w-full group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                {post.title}
              </CardTitle>
              <CardDescription className="text-gray-600 line-clamp-3 text-sm">
                {cleanDescription}
              </CardDescription>
            </div>
            <Badge className={`ml-2 flex-shrink-0 ${getCategoryColor(post.category)}`}>
              {getCategoryLabel(post.category)}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(post.createdAt)}
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {post.author.name}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Contenido multimedia */}
          {hasMultimedia && (
            <div className="mb-4">
              {/* Imágenes */}
              {hasImages && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <ImageIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Imágenes</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {post.images.slice(0, 2).map((image, index) => (
                      <img
                        key={image._id || index}
                        src={image.url}
                        alt={`Imagen ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md border border-gray-200"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                    ))}
                    {post.images.length > 2 && (
                      <div className="flex items-center justify-center bg-gray-100 rounded-md h-24 text-gray-500 text-sm">
                        +{post.images.length - 2} más
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Documentos */}
              {hasDocuments && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Documentos</span>
                  </div>
                  <div className="space-y-2">
                    {post.documents.slice(0, 2).map((document, index) => (
                      <div
                        key={document._id || index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <FileText className="h-4 w-4 text-red-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700 truncate">
                            {document.filename || `Documento ${index + 1}`}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) =>
                            handleDownload(
                              document.url,
                              document.filename || `document-${index + 1}`,
                              e
                            )
                          }
                          className="border-red-200 text-red-600 hover:bg-red-50 flex-shrink-0 ml-2"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    {post.documents.length > 2 && (
                      <div className="text-center text-sm text-gray-500 py-2">
                        +{post.documents.length - 2} documentos más
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Indicador visual de que la card es clickeable */}
          <div className="flex items-center justify-center gap-2 text-sm text-red-600 font-medium pt-3 border-t border-gray-100">
            <Eye className="h-4 w-4" />
            Ver publicación
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
