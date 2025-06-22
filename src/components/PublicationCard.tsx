
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, Calendar, User } from "lucide-react";
import { Publication } from "@/types/Publication";

interface PublicationCardProps {
  publication: Publication;
  onView?: (publication: Publication) => void;
}

export const PublicationCard = ({ publication, onView }: PublicationCardProps) => {
  const handleDownload = (fileUrl: string, filename: string) => {
    // En una implementación real, esto descargaría el archivo
    console.log(`Downloading: ${filename}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'general': 'bg-blue-100 text-blue-700',
      'mantenimiento': 'bg-green-100 text-green-700',
      'seguridad': 'bg-red-100 text-red-700',
      'eventos': 'bg-purple-100 text-purple-700',
      'avisos': 'bg-orange-100 text-orange-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 border-red-100 hover:border-red-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
              {publication.title}
            </CardTitle>
            <CardDescription className="text-gray-600 line-clamp-2">
              {publication.description}
            </CardDescription>
          </div>
          <Badge className={`ml-2 ${getCategoryColor(publication.category)}`}>
            {publication.category}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatDate(publication.createdAt)}
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {publication.author}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {publication.images && publication.images.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {publication.images.slice(0, 2).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Imagen ${index + 1}`}
                className="w-full h-32 object-cover rounded-md border border-gray-200"
              />
            ))}
            {publication.images.length > 2 && (
              <div className="flex items-center justify-center bg-gray-100 rounded-md h-32 text-gray-500">
                +{publication.images.length - 2} más
              </div>
            )}
          </div>
        )}

        {publication.attachments && publication.attachments.length > 0 && (
          <div className="space-y-2 mb-4">
            <h4 className="text-sm font-medium text-gray-700">Archivos adjuntos:</h4>
            {publication.attachments.map((attachment, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-gray-700">{attachment.name}</span>
                  <span className="text-xs text-gray-500">({attachment.type})</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(attachment.url, attachment.name)}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          {onView && (
            <Button
              onClick={() => onView(publication)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              <Eye className="h-4 w-4 mr-2" />
              Ver completo
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
