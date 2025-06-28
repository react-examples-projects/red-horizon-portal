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
import { useGetPostById, useUpdatePost } from "@/hooks/usePosts";
import RichTextEditor from "@/components/ui/RichEditorText";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EditPublication = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  // Hooks de React Query
  const { data: publication, isLoading: isLoadingData, error, refetch } = useGetPostById(id || "");

  const updatePostMutation = useUpdatePost();

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
    }
  }, [publication]);

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
              <CardTitle className="text-red-700">Información de la Publicación</CardTitle>
              <CardDescription>Actualiza los datos de la publicación</CardDescription>
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
