
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EditPublication = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const categories = [
    { value: "general", label: "General" },
    { value: "mantenimiento", label: "Mantenimiento" },
    { value: "seguridad", label: "Seguridad" },
    { value: "eventos", label: "Eventos" },
    { value: "avisos", label: "Avisos" }
  ];

  useEffect(() => {
    // Simulación de carga de datos de la publicación
    setTimeout(() => {
      setTitle("Ejemplo de Publicación a Editar");
      setDescription("Esta es una descripción de ejemplo para la publicación que se está editando.");
      setCategory("general");
      setIsLoadingData(false);
    }, 1000);
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulación de guardado
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Publicación actualizada",
        description: "Los cambios han sido guardados exitosamente",
      });
      navigate("/admin");
    }, 2000);
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando publicación...</p>
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
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={6}
                  className="border-red-200 focus:ring-red-500 focus:border-red-500"
                  placeholder="Describe detalladamente el contenido de la publicación..."
                />
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
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
