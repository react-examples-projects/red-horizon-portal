import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPublicPostById } from "@/hooks/usePosts";
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
  Lock,
  ExternalLink,
} from "lucide-react";

const PublicPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Hook para obtener el post público por ID
  const { data: post, isLoading, error, refetch } = useGetPublicPostById(id || "");

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

  const getFileIcon = (fileName: string) => {
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
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

  const handleLoginRedirect = () => {
    navigate("/login");
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
                onClick={() => navigate("/")}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Volver al Inicio
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
              onClick={() => navigate("/")}
              variant="outline"
              size="sm"
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Inicio
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

        {/* Post Content */}
        {!isLoading && post && (
          <div className="space-y-6">
            {/* Main Post Card */}
            <Card className="border-red-100 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className={getCategoryColor(post.category)}>
                        {getCategoryLabel(post.category)}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Eye className="h-4 w-4" />
                        <span>Vista pública</span>
                      </div>
                    </div>
                    <CardTitle className="text-3xl font-bold text-gray-900 mb-3">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-lg">
                      Publicado por {post.author.name}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Post Info */}
                <div className="flex flex-wrap gap-6 text-sm text-gray-600 border-b border-gray-200 pb-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Autor: {post.author.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Creado: {formatDate(post.createdAt)}</span>
                  </div>
                  {post.updatedAt !== post.createdAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Actualizado: {formatDate(post.updatedAt)}</span>
                    </div>
                  )}
                </div>

                {/* Post Description */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Descripción</h3>
                  <div
                    className="text-gray-700 leading-relaxed prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.description }}
                  />
                </div>

                {/* Images Section */}
                {post.images && post.images.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <ImageIcon className="h-6 w-6" />
                      Imágenes ({post.images.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {post.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image.url}
                            alt={`Imagen ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg border border-gray-200 shadow-md"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                            <Button
                              size="sm"
                              variant="secondary"
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              onClick={() => window.open(image.url, "_blank")}
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents Section */}
                {post.documents && post.documents.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="h-6 w-6" />
                      Documentos ({post.documents.length})
                    </h3>
                    <div className="space-y-3">
                      {post.documents.map((document, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {getFileIcon(document.filename)}
                            <div>
                              <p className="font-medium text-gray-900">{document.filename}</p>
                              <p className="text-sm text-gray-500">
                                {formatFileSize(document.size)}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(document.url, document.filename)}
                            className="border-blue-200 text-blue-600 hover:bg-blue-50"
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
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicPost;
