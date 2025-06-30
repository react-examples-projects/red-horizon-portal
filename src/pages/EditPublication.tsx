import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSession from "@/hooks/useSession";
import { useGetPostById, useUpdatePostWithFiles } from "@/hooks/usePosts";
import RichTextEditor from "@/components/ui/RichEditorText";
import { Upload, X, FileText, Image, ArrowLeft, File, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EditPublication = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  // Estados para archivos existentes
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [existingDocuments, setExistingDocuments] = useState<any[]>([]);

  // Estados para nuevos archivos
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newDocuments, setNewDocuments] = useState<File[]>([]);

  // Estados para archivos a eliminar
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [documentsToDelete, setDocumentsToDelete] = useState<string[]>([]);

  // Hooks de React Query
  const { data: publication, isLoading: isLoadingData, error, refetch } = useGetPostById(id || "");
  const updatePostMutation = useUpdatePostWithFiles();

  const categories = [
    { value: "general", label: "General" },
    { value: "mantenimiento", label: "Mantenimiento" },
    { value: "seguridad", label: "Seguridad" },
    { value: "eventos", label: "Eventos" },
    { value: "avisos", label: "Avisos" },
  ];

  // Cargar datos de la publicación cuando se obtengan
  useEffect(() => {
    if (publication) {
      setTitle(publication.title);
      setDescription(publication.description);
      setCategory(publication.category);
      setExistingImages(publication.images || []);
      setExistingDocuments(publication.documents || []);
    }
  }, [publication]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validImages = files.filter((file) => file.type.startsWith("image/"));
    setNewImages([...newImages, ...validImages]);
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(
      (file) =>
        file.type === "application/pdf" ||
        file.type.includes("word") ||
        file.type.includes("excel") ||
        file.type.includes("spreadsheet") ||
        file.name.endsWith(".pdf") ||
        file.name.endsWith(".doc") ||
        file.name.endsWith(".docx") ||
        file.name.endsWith(".xls") ||
        file.name.endsWith(".xlsx")
    );
    setNewDocuments([...newDocuments, ...validFiles]);
  };

  const removeNewImage = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  const removeNewDocument = (index: number) => {
    setNewDocuments(newDocuments.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageId: string) => {
    setImagesToDelete([...imagesToDelete, imageId]);
    setExistingImages(existingImages.filter((img) => img._id !== imageId));
  };

  const removeExistingDocument = (documentId: string) => {
    setDocumentsToDelete([...documentsToDelete, documentId]);
    setExistingDocuments(existingDocuments.filter((doc) => doc._id !== documentId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      toast({
        title: "Error",
        description: "ID de publicación no válido",
        variant: "destructive",
      });
      return;
    }

    try {
      await updatePostMutation.mutateAsync({
        id,
        data: {
          title,
          description,
          category,
          images: newImages.length > 0 ? newImages : undefined,
          documents: newDocuments.length > 0 ? newDocuments : undefined,
          imagesToDelete: imagesToDelete.length > 0 ? imagesToDelete : undefined,
          documentsToDelete: documentsToDelete.length > 0 ? documentsToDelete : undefined,
        },
      });

      toast({
        title: "Publicación actualizada",
        description: "Los cambios han sido guardados exitosamente",
      });
      navigate("/admin");
    } catch (error) {
      console.error("Error al actualizar la publicación:", error);
      toast({
        title: "Error",
        description: "Hubo un error al actualizar la publicación. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-red-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-red-600 mx-auto mb-4" />
            <p className="text-gray-600">Cargando publicación...</p>
          </div>
        </div>
      </div>
    );
  }

  const isLoading = updatePostMutation.isPending;

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Publicación</h1>
          <p className="text-gray-600">Modifica la información de la publicación</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="border-red-100">
            <CardHeader>
              <CardTitle className="text-red-700">Información Básica</CardTitle>
              <CardDescription>Actualiza los datos principales de la publicación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="border-red-200 focus:ring-red-500 focus:border-red-500"
                  placeholder="Ingresa el título de la publicación"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoría *</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger className="border-red-200 focus:ring-red-500 focus:border-red-500">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción *</Label>
                <RichTextEditor value={description} onChange={setDescription} />
              </div>
            </CardContent>
          </Card>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <Card className="border-red-100">
              <CardHeader>
                <CardTitle className="text-red-700">Imágenes Existentes</CardTitle>
                <CardDescription>
                  Imágenes actuales de la publicación. Puedes eliminarlas si lo deseas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {existingImages.map((image, index) => (
                    <div key={image._id} className="relative group">
                      <img
                        src={image.url}
                        alt={`Imagen ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeExistingImage(image._id)}
                          className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-xs text-white bg-black bg-opacity-50 rounded px-2 py-1 truncate">
                          Imagen {index + 1}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* New Images Upload */}
          <Card className="border-red-100">
            <CardHeader>
              <CardTitle className="text-red-700">Agregar Nuevas Imágenes</CardTitle>
              <CardDescription>
                Agrega nuevas imágenes para ilustrar tu publicación (opcional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-red-200 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Image className="h-8 w-8 text-red-400 mx-auto mb-2" />
                  <p className="text-red-600 font-medium">Haz clic para subir nuevas imágenes</p>
                  <p className="text-sm text-gray-500">PNG, JPG, GIF hasta 10MB cada una</p>
                </label>
              </div>

              {newImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {newImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-xs text-white bg-black bg-opacity-50 rounded px-2 py-1 truncate">
                          {image.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Existing Documents */}
          {existingDocuments.length > 0 && (
            <Card className="border-red-100">
              <CardHeader>
                <CardTitle className="text-red-700">Documentos Existentes</CardTitle>
                <CardDescription>
                  Documentos actuales de la publicación. Puedes eliminarlos si lo deseas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {existingDocuments.map((document) => (
                    <div
                      key={document._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {getFileIcon(document.filename)}
                        <div>
                          <p className="font-medium text-gray-900">{document.filename}</p>
                          <p className="text-sm text-gray-500">{formatFileSize(document.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExistingDocument(document._id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* New Documents Upload */}
          <Card className="border-red-100">
            <CardHeader>
              <CardTitle className="text-red-700">Agregar Nuevos Documentos</CardTitle>
              <CardDescription>
                Adjunta nuevos documentos importantes (PDF, Word, Excel)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-red-200 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  onChange={handleDocumentUpload}
                  className="hidden"
                  id="document-upload"
                />
                <label htmlFor="document-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-red-400 mx-auto mb-2" />
                  <p className="text-red-600 font-medium">Haz clic para subir nuevos documentos</p>
                  <p className="text-sm text-gray-500">PDF, Word, Excel hasta 25MB cada uno</p>
                </label>
              </div>

              {newDocuments.length > 0 && (
                <div className="space-y-2">
                  {newDocuments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.name)}
                        <div>
                          <p className="font-medium text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeNewDocument(index)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin")}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !title || !description || !category}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando cambios...
                </div>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPublication;
