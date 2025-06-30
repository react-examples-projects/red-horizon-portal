import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import HtmlContent from "@/components/ui/html-content";
import useSession from "@/hooks/useSession";
import { useGetPostById } from "@/hooks/usePosts";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Eye,
  Calendar,
  User,
  FileText,
  Image as ImageIcon,
  File,
  Download,
  Loader2,
} from "lucide-react";

const ViewPublication = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSession();
  const { toast } = useToast();

  // Hook para obtener el post por ID
  const { data: publication, isLoading, error, refetch } = useGetPostById(id || "");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  const getFileIcon = (fileName: string | undefined | null) => {
    if (!fileName) {
      return <FileText className="h-5 w-5 text-gray-500" />;
    }

    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "doc":
      case "docx":
        return <File className="h-5 w-5 text-blue-500" />;
      case "xls":
      case "xlsx":
        return <File className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number | undefined | null) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDownload = (url: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-red-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error al cargar la publicación
            </h3>
            <p className="text-gray-600 mb-4">No se pudo cargar la publicación solicitada</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => refetch()} className="bg-red-600 hover:bg-red-700 text-white">
                Reintentar
              </Button>
              <Button
                onClick={() => navigate("/admin")}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Volver al Panel
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={() => navigate("/admin")}
              variant="outline"
              size="sm"
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Panel
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-6">
            <Card className="border-red-100">
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Publication Content */}
        {!isLoading && publication && (
          <div className="space-y-6">
            {/* Main Publication Card */}
            <Card className="border-red-100">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className={getCategoryColor(publication.category)}>
                        {getCategoryLabel(publication.category)}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Eye className="h-4 w-4" />
                        <span>Vista previa</span>
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                      {publication.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      Publicado por {publication.author.name}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Publication Info */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Autor: {publication.author.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Creado: {formatDate(publication.createdAt)}</span>
                  </div>
                  {publication.updatedAt !== publication.createdAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Actualizado: {formatDate(publication.updatedAt)}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Descripción</h3>
                  <div className="prose prose-sm max-w-none">
                    <HtmlContent content={publication.description} />
                  </div>
                </div>

                {/* Images */}
                {publication.images && publication.images.length > 0 && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Imágenes ({publication.images.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {publication.images.map((image: any, index: number) => (
                        <div key={index} className="relative group">
                          <img
                            src={image?.url}
                            alt={`Imagen ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg";
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                            <Button
                              size="sm"
                              variant="secondary"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => window.open(image?.url, "_blank")}
                              disabled={!image?.url}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents */}
                {publication.documents && publication.documents.length > 0 && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Documentos ({publication.documents.length})
                    </h3>
                    <div className="space-y-3">
                      {publication.documents.map((document: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {getFileIcon(document?.filename)}
                            <div>
                              <p className="font-medium text-gray-900">
                                {document?.filename || "Documento sin nombre"}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatFileSize(document?.size)}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleDownload(document?.url, document?.filename || "documento")
                            }
                            className="border-blue-200 text-blue-600 hover:bg-blue-50"
                            disabled={!document?.url}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Descargar
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => navigate(`/admin/editar-publicacion/${publication._id}`)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <FileText className="h-4 w-4 mr-2" />
                Editar Publicación
              </Button>
              <Button
                onClick={() => navigate("/admin")}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Volver al Panel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPublication;
