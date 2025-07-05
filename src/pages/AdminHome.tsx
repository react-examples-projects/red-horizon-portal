import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, X, Loader2, Save, Upload, FileText, Image, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useGetHomeContent,
  useUpdateHomeContent,
  useUploadDownloadFile,
  useUploadGalleryImage,
  useUploadInfoMainImage,
  useDeleteGalleryImage,
  HomeContent,
} from "@/hooks/useHomeContent";

const AdminHome = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Hooks para manejar el contenido del Home
  const { data: homeContent, isLoading: isLoadingContent, error } = useGetHomeContent();
  const updateHomeContentMutation = useUpdateHomeContent();
  const uploadDownloadFileMutation = useUploadDownloadFile();
  const uploadGalleryImageMutation = useUploadGalleryImage();
  const uploadInfoMainImageMutation = useUploadInfoMainImage();
  const deleteGalleryImageMutation = useDeleteGalleryImage();

  // Estados para archivos por item - Separados por tipo
  const [uploadingDownloads, setUploadingDownloads] = useState<{
    [key: string]: {
      file: File | null;
      title: string;
      description: string;
      type?: string;
      size?: string;
    };
  }>({});

  const [uploadingGalleryImages, setUploadingGalleryImages] = useState<{
    [key: string]: {
      file: File | null;
      title: string;
      description: string;
      type?: string;
      size?: string;
    };
  }>({});

  const [uploadingInfoMainImage, setUploadingInfoMainImage] = useState<{
    file: File | null;
    title: string;
    description: string;
    type?: string;
    size?: string;
  } | null>(null);

  const [content, setContent] = useState<HomeContent | null>(null);

  // Cargar contenido cuando se obtiene del servidor
  useEffect(() => {
    if (homeContent) {
      setContent(homeContent);
    }
  }, [homeContent]);

  // Función para crear contenido inicial
  const createInitialContent = () => {
    const initialContent: HomeContent = {
      hero: {
        title: "",
        subtitle: "",
        description: "",
        primaryButtonText: "",
        secondaryButtonText: "",
      },
      features: {
        title: "",
        description: "",
        cards: [],
      },
      downloads: {
        title: "",
        description: "",
        items: [],
      },
      info: {
        title: "",
        description: "",
        mainImage: null,
        sections: [],
      },
      gallery: {
        title: "",
        description: "",
        images: [],
      },
    };
    setContent(initialContent);
  };

  const handleSave = async () => {
    try {
      if (!content) {
        toast({
          title: "Error",
          description: "No hay contenido para guardar",
          variant: "destructive",
        });
        return;
      }

      // Obtener los IDs de items que realmente existen en el contenido actual
      const existingDownloadIds = new Set(content.downloads.items.map((item) => item.id));
      const existingGalleryIds = new Set(content.gallery.images.map((image) => image.id));

      // Filtrar archivos de descarga que pertenecen a items existentes
      const validDownloadPromises = Object.entries(uploadingDownloads)
        .filter(([itemId, item]) => existingDownloadIds.has(itemId) && item?.file)
        .map(async ([itemId, item]) => {
          const result = await uploadDownloadFileMutation.mutateAsync({
            file: item.file,
            title: item.title,
            description: item.description,
            type: item.type || "pdf",
            itemId,
          });
          console.log("handleSave - Archivo de descarga subido:", result);
          return result;
        });

      // Filtrar imágenes de galería que pertenecen a items existentes
      const validGalleryPromises = Object.entries(uploadingGalleryImages)
        .filter(([itemId, item]) => existingGalleryIds.has(itemId) && item?.file)
        .map(async ([itemId, item]) => {
          const result = await uploadGalleryImageMutation.mutateAsync({
            file: item.file,
            title: item.title,
            description: item.description,
            itemId,
          });
          console.log("handleSave - Imagen de galería subida:", result);
          return result;
        });

      // Subir imagen principal de información si existe
      console.log("handleSave - Verificando imagen principal:", uploadingInfoMainImage);
      let uploadedMainImage = null;

      if (uploadingInfoMainImage?.file) {
        const result = await uploadInfoMainImageMutation.mutateAsync({
          file: uploadingInfoMainImage.file,
          title: uploadingInfoMainImage.title,
          description: uploadingInfoMainImage.description,
        });
        uploadedMainImage = result.image;
        console.log("handleSave - Imagen principal subida:", uploadedMainImage);
      }

      // Esperar a que se suban todos los archivos válidos
      const uploadResults = await Promise.all([...validDownloadPromises, ...validGalleryPromises]);
      console.log("handleSave - Resultados de subida:", uploadResults);

      // Obtener el contenido más reciente después de las subidas
      let updatedContent = content;

      // Si se subió imagen principal, actualizar el contenido
      if (uploadedMainImage) {
        updatedContent = {
          ...updatedContent,
          info: {
            ...updatedContent.info,
            mainImage: uploadedMainImage,
          },
        };
        console.log(
          "handleSave - Contenido actualizado con imagen principal:",
          updatedContent.info.mainImage
        );
      }

      // Si se subieron archivos, usar el contenido actualizado del último resultado
      if (uploadResults.length > 0) {
        const lastResult = uploadResults[uploadResults.length - 1];
        if (lastResult && lastResult.content) {
          updatedContent = lastResult.content;
          console.log("handleSave - Usando contenido actualizado de subida:", updatedContent);
        }
      }

      // Filtrar imágenes temporales que no se subieron
      const tempImageIds = Object.keys(uploadingGalleryImages);
      if (tempImageIds.length > 0) {
        updatedContent = {
          ...updatedContent,
          gallery: {
            ...updatedContent.gallery,
            images: updatedContent.gallery.images.filter(
              (image) => !tempImageIds.includes(image.id) || image.url !== ""
            ),
          },
        };
        console.log(
          "handleSave - Contenido filtrado de imágenes temporales:",
          updatedContent.gallery.images
        );
      }

      // Asegurar que no haya imágenes duplicadas
      const uniqueImages = [];
      const seenIds = new Set();
      updatedContent.gallery.images.forEach((image) => {
        if (!seenIds.has(image.id)) {
          seenIds.add(image.id);
          uniqueImages.push(image);
        }
      });
      updatedContent.gallery.images = uniqueImages;

      // Luego guardar el contenido
      console.log("handleSave - Contenido a guardar:", updatedContent);
      console.log("handleSave - mainImage en contenido a guardar:", updatedContent.info.mainImage);

      await updateHomeContentMutation.mutateAsync(updatedContent);

      // Actualizar el estado local con el contenido guardado
      setContent(updatedContent);
      console.log("handleSave - Estado local actualizado");

      // Limpiar todos los estados de subida
      setUploadingDownloads({});
      setUploadingGalleryImages({});
      setUploadingInfoMainImage(null);

      toast({
        title: "Contenido guardado",
        description: "Los cambios y archivos han sido guardados exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al guardar los cambios",
        variant: "destructive",
      });
    }
  };

  // Función para detectar el tipo de archivo basado en la extensión
  const detectFileType = (filename: string): string => {
    const extension = filename.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "pdf";
      case "doc":
      case "docx":
        return "word";
      case "xls":
      case "xlsx":
        return "excel";
      case "txt":
        return "txt";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
        return "image";
      default:
        return "pdf";
    }
  };

  // Función para formatear el tamaño del archivo
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Funciones para manejar archivos por item
  const handleDownloadFileChange = (itemId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const detectedType = detectFileType(file.name);
      const fileSize = formatFileSize(file.size);

      setUploadingDownloads((prev) => ({
        ...prev,
        [itemId]: {
          file,
          title: file.name.replace(/\.[^/.]+$/, ""), // Quitar la extensión del nombre
          description: "",
          type: detectedType,
          size: fileSize,
        },
      }));
    }
    // Resetear el input para permitir seleccionar el mismo archivo nuevamente
    event.target.value = "";
  };

  const handleGalleryImageChange = (itemId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const detectedType = detectFileType(file.name);
      const fileSize = formatFileSize(file.size);

      setUploadingGalleryImages((prev) => ({
        ...prev,
        [itemId]: {
          file,
          title: file.name.replace(/\.[^/.]+$/, ""), // Quitar la extensión del nombre
          description: "",
          type: detectedType,
          size: fileSize,
        },
      }));
    }
    // Resetear el input para permitir seleccionar el mismo archivo nuevamente
    event.target.value = "";
  };

  const cancelDownloadUpload = (itemId: string) => {
    setUploadingDownloads((prev) => {
      const newState = { ...prev };
      delete newState[itemId];
      return newState;
    });
  };

  const cancelGalleryUpload = (itemId: string) => {
    setUploadingGalleryImages((prev) => {
      const newState = { ...prev };
      delete newState[itemId];
      return newState;
    });
  };

  const handleInfoMainImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const detectedType = detectFileType(file.name);
      const fileSize = formatFileSize(file.size);

      setUploadingInfoMainImage({
        file,
        title: file.name.replace(/\.[^/.]+$/, ""), // Quitar la extensión del nombre
        description: "",
        type: detectedType,
        size: fileSize,
      });
    }
    // Resetear el input para permitir seleccionar el mismo archivo nuevamente
    event.target.value = "";
  };

  const cancelInfoMainImageUpload = () => {
    setUploadingInfoMainImage(null);
  };

  const updateHero = (field: keyof HomeContent["hero"], value: string) => {
    setContent((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        hero: { ...prev.hero, [field]: value },
      };
    });
  };

  const updateFeatures = (field: keyof HomeContent["features"], value: string) => {
    setContent((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        features: { ...prev.features, [field]: value },
      };
    });
  };

  const updateFeatureCard = (id: string, field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        cards: prev.features.cards.map((card) =>
          card.id === id ? { ...card, [field]: value } : card
        ),
      },
    }));
  };

  const addFeatureCard = () => {
    const newId = (content.features.cards.length + 1).toString();
    setContent((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        cards: [
          ...prev.features.cards,
          {
            id: newId,
            title: "Nueva característica",
            description: "Descripción de la nueva característica",
            icon: "FileText",
          },
        ],
      },
    }));
  };

  const removeFeatureCard = (id: string) => {
    setContent((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        cards: prev.features.cards.filter((card) => card.id !== id),
      },
    }));
  };

  const updateDownloads = (field: keyof HomeContent["downloads"], value: string) => {
    setContent((prev) => ({
      ...prev,
      downloads: { ...prev.downloads, [field]: value },
    }));
  };

  const updateDownloadItem = (id: string, field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      downloads: {
        ...prev.downloads,
        items: prev.downloads.items.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const addDownloadItem = () => {
    const newId = (content.downloads.items.length + 1).toString();
    setContent((prev) => ({
      ...prev,
      downloads: {
        ...prev.downloads,
        items: [
          ...prev.downloads.items,
          {
            id: newId,
            title: "Nuevo archivo",
            description: "Descripción del archivo",
            type: "pdf",
            url: "", // URL vacía hasta que se suba un archivo
            size: "",
          },
        ],
      },
    }));
  };

  const removeDownloadItem = (id: string) => {
    setContent((prev) => ({
      ...prev,
      downloads: {
        ...prev.downloads,
        items: prev.downloads.items.filter((item) => item.id !== id),
      },
    }));

    // Limpiar el estado de subida para este item
    setUploadingDownloads((prev) => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  const updateInfo = (field: keyof HomeContent["info"], value: string) => {
    setContent((prev) => ({
      ...prev,
      info: { ...prev.info, [field]: value },
    }));
  };

  const updateInfoSection = (id: string, field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      info: {
        ...prev.info,
        sections: prev.info.sections.map((section) =>
          section.id === id ? { ...section, [field]: value } : section
        ),
      },
    }));
  };

  const addInfoSection = () => {
    const newId = (content.info.sections.length + 1).toString();
    setContent((prev) => ({
      ...prev,
      info: {
        ...prev.info,
        sections: [
          ...prev.info.sections,
          {
            id: newId,
            title: "Nueva sección",
            description: "Descripción de la nueva sección",
            icon: "FileText",
          },
        ],
      },
    }));
  };

  const removeInfoSection = (id: string) => {
    setContent((prev) => ({
      ...prev,
      info: {
        ...prev.info,
        sections: prev.info.sections.filter((section) => section.id !== id),
      },
    }));
  };

  const updateGallery = (field: keyof HomeContent["gallery"], value: string) => {
    setContent((prev) => ({
      ...prev,
      gallery: { ...prev.gallery, [field]: value },
    }));
  };

  const updateGalleryImageItem = (id: string, field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      gallery: {
        ...prev.gallery,
        images: prev.gallery.images.map((image) =>
          image.id === id ? { ...image, [field]: value } : image
        ),
      },
    }));
  };

  const addGalleryImage = () => {
    const newId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setContent((prev) => ({
      ...prev,
      gallery: {
        ...prev.gallery,
        images: [
          ...prev.gallery.images,
          {
            id: newId,
            title: "Nueva imagen",
            description: "Descripción de la nueva imagen",
            url: "", // URL vacía hasta que se suba una imagen
          },
        ],
      },
    }));
  };

  const removeGalleryImageItem = (id: string) => {
    setContent((prev) => ({
      ...prev,
      gallery: {
        ...prev.gallery,
        images: prev.gallery.images.filter((image) => image.id !== id),
      },
    }));

    // Limpiar el estado de subida para este item
    setUploadingGalleryImages((prev) => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  const deleteGalleryImage = async (imageId: string) => {
    try {
      await deleteGalleryImageMutation.mutateAsync(imageId);

      // Actualizar el estado local
      setContent((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          gallery: {
            ...prev.gallery,
            images: prev.gallery.images.filter((image) => image.id !== imageId),
          },
        };
      });

      toast({
        title: "Imagen eliminada",
        description: "La imagen ha sido eliminada exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al eliminar la imagen",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {isLoadingContent && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-red-600 mx-auto mb-4" />
            <p className="text-gray-600">Cargando contenido del Home...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <div className="text-red-600 mb-4">
              <p className="text-lg font-medium">Error al cargar el contenido</p>
              <p className="text-sm">No se pudo cargar el contenido del Home</p>
            </div>
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Reintentar
            </Button>
          </div>
        )}

        {/* Content */}
        {!isLoadingContent && !error && (
          <>
            {/* Estado vacío */}
            {!content && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <div className="text-gray-400 mb-4">
                      <svg
                        className="mx-auto h-12 w-12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No hay contenido configurado
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Aún no se ha configurado el contenido de la página principal. Haz clic en el
                      botón para comenzar a crear el contenido.
                    </p>
                    <Button
                      onClick={createInitialContent}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Contenido Inicial
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Contenido existente */}
            {content && (
              <>
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
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Administrar Página Home
                      </h1>
                      <p className="text-gray-600">Gestiona el contenido de la página principal</p>
                    </div>
                    <Button
                      onClick={handleSave}
                      disabled={updateHomeContentMutation.isPending}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      {updateHomeContentMutation.isPending ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Guardando...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Save className="w-4 h-4" />
                          Guardar Cambios
                        </div>
                      )}
                    </Button>
                  </div>
                </div>

                <Tabs defaultValue="hero" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="hero">Hero</TabsTrigger>
                    <TabsTrigger value="features">Características</TabsTrigger>
                    <TabsTrigger value="downloads">Descargas</TabsTrigger>
                    <TabsTrigger value="info">Información</TabsTrigger>
                    <TabsTrigger value="gallery">Galería</TabsTrigger>
                  </TabsList>

                  {/* Hero Section */}
                  <TabsContent value="hero" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Sección Hero</CardTitle>
                        <CardDescription>
                          Configura el contenido principal de la página
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="hero-title">Título Principal</Label>
                            <Input
                              id="hero-title"
                              value={content.hero.title}
                              onChange={(e) => updateHero("title", e.target.value)}
                              placeholder="Título principal"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="hero-subtitle">Subtítulo</Label>
                            <Input
                              id="hero-subtitle"
                              value={content.hero.subtitle}
                              onChange={(e) => updateHero("subtitle", e.target.value)}
                              placeholder="Subtítulo"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="hero-description">Descripción</Label>
                          <Textarea
                            id="hero-description"
                            value={content.hero.description}
                            onChange={(e) => updateHero("description", e.target.value)}
                            placeholder="Descripción del hero"
                            rows={4}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="hero-primary-button">Texto Botón Principal</Label>
                            <Input
                              id="hero-primary-button"
                              value={content.hero.primaryButtonText}
                              onChange={(e) => updateHero("primaryButtonText", e.target.value)}
                              placeholder="Texto del botón principal"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="hero-secondary-button">Texto Botón Secundario</Label>
                            <Input
                              id="hero-secondary-button"
                              value={content.hero.secondaryButtonText}
                              onChange={(e) => updateHero("secondaryButtonText", e.target.value)}
                              placeholder="Texto del botón secundario"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Features Section */}
                  <TabsContent value="features" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Sección de Características</CardTitle>
                        <CardDescription>Gestiona las características principales</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="features-title">Título de la Sección</Label>
                            <Input
                              id="features-title"
                              value={content.features.title}
                              onChange={(e) => updateFeatures("title", e.target.value)}
                              placeholder="Título de la sección"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="features-description">Descripción</Label>
                            <Input
                              id="features-description"
                              value={content.features.description}
                              onChange={(e) => updateFeatures("description", e.target.value)}
                              placeholder="Descripción de la sección"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>Tarjetas de Características</Label>
                            <Button onClick={addFeatureCard} variant="outline" size="sm">
                              Agregar Tarjeta
                            </Button>
                          </div>
                          {content.features.cards.map((card, index) => (
                            <Card key={card.id} className="p-4">
                              <div className="flex items-start justify-between mb-4">
                                <h4 className="font-medium">Tarjeta {index + 1}</h4>
                                <Button
                                  onClick={() => removeFeatureCard(card.id)}
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Título</Label>
                                  <Input
                                    value={card.title}
                                    onChange={(e) =>
                                      updateFeatureCard(card.id, "title", e.target.value)
                                    }
                                    placeholder="Título de la tarjeta"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Icono</Label>
                                  <Select
                                    value={card.icon}
                                    onValueChange={(value) =>
                                      updateFeatureCard(card.id, "icon", value)
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="BookCopy">Libro</SelectItem>
                                      <SelectItem value="FileText">Documento</SelectItem>
                                      <SelectItem value="Users">Usuarios</SelectItem>
                                      <SelectItem value="MapPinHouse">Ubicación</SelectItem>
                                      <SelectItem value="BookText">Texto</SelectItem>
                                      <SelectItem value="UsersRound">Usuarios Redondos</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="space-y-2 mt-4">
                                <Label>Descripción</Label>
                                <Textarea
                                  value={card.description}
                                  onChange={(e) =>
                                    updateFeatureCard(card.id, "description", e.target.value)
                                  }
                                  placeholder="Descripción de la característica"
                                  rows={3}
                                />
                              </div>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Downloads Section */}
                  <TabsContent value="downloads" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Sección de Descargas</CardTitle>
                        <CardDescription>
                          Gestiona los archivos y enlaces descargables
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="downloads-title">Título de la Sección</Label>
                            <Input
                              id="downloads-title"
                              value={content.downloads.title}
                              onChange={(e) => updateDownloads("title", e.target.value)}
                              placeholder="Título de la sección"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="downloads-description">Descripción</Label>
                            <Input
                              id="downloads-description"
                              value={content.downloads.description}
                              onChange={(e) => updateDownloads("description", e.target.value)}
                              placeholder="Descripción de la sección"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>Elementos Descargables</Label>
                            <Button onClick={addDownloadItem} variant="outline" size="sm">
                              Agregar Elemento
                            </Button>
                          </div>
                          {content.downloads.items.map((item, index) => (
                            <Card key={item.id} className="p-4">
                              <div className="flex items-start justify-between mb-4">
                                <h4 className="font-medium">Elemento {index + 1}</h4>
                                <div className="flex gap-2">
                                  {/* Botón de subida de archivo */}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-blue-600 hover:text-blue-700"
                                    onClick={() => {
                                      const input = document.getElementById(
                                        `download-file-${item.id}`
                                      ) as HTMLInputElement;
                                      if (input) input.click();
                                    }}
                                  >
                                    <Upload className="h-4 w-4 mr-1" />
                                    Subir Archivo
                                  </Button>
                                  <Input
                                    id={`download-file-${item.id}`}
                                    type="file"
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                                    onChange={(e) => handleDownloadFileChange(item.id, e)}
                                    className="hidden"
                                  />
                                  <Button
                                    onClick={() => removeDownloadItem(item.id)}
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              {/* Campos editables del item */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="space-y-2">
                                  <Label>Título del archivo</Label>
                                  <Input
                                    value={item.title}
                                    onChange={(e) =>
                                      updateDownloadItem(item.id, "title", e.target.value)
                                    }
                                    placeholder="Título del archivo"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Descripción</Label>
                                  <Input
                                    value={item.description || ""}
                                    onChange={(e) =>
                                      updateDownloadItem(item.id, "description", e.target.value)
                                    }
                                    placeholder="Descripción del archivo"
                                  />
                                </div>
                              </div>

                              {/* Formulario de subida si hay archivo seleccionado */}
                              {uploadingDownloads[item.id]?.file && (
                                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-blue-800">
                                        Archivo: {uploadingDownloads[item.id].file?.name}
                                      </p>
                                      <p className="text-xs text-blue-600">
                                        Tipo: {uploadingDownloads[item.id].type} • Tamaño:{" "}
                                        {uploadingDownloads[item.id].size}
                                      </p>
                                    </div>
                                    <Button
                                      onClick={() => cancelDownloadUpload(item.id)}
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>

                                  <div className="space-y-1 mb-2">
                                    <Label className="text-xs">Descripción</Label>
                                    <Textarea
                                      value={uploadingDownloads[item.id].description}
                                      onChange={(e) =>
                                        setUploadingDownloads((prev) => ({
                                          ...prev,
                                          [item.id]: {
                                            ...prev[item.id],
                                            description: e.target.value,
                                          },
                                        }))
                                      }
                                      placeholder="Descripción del archivo"
                                      rows={2}
                                      className="text-sm"
                                    />
                                  </div>

                                  <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                    Se subirá al guardar cambios
                                  </div>
                                </div>
                              )}

                              {/* Mostrar datos del archivo si ya existe */}
                              {item.url && item.url !== "" && !item.url.startsWith("/docs/") ? (
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                  <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                      <FileText className="h-8 w-8 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between mb-2">
                                        <h5 className="font-medium text-green-800">{item.title}</h5>
                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                          {item.type?.toUpperCase() || "PDF"}
                                        </span>
                                      </div>
                                      {item.description && (
                                        <p className="text-sm text-green-700 mb-2">
                                          {item.description}
                                        </p>
                                      )}
                                      <div className="flex items-center gap-4 text-xs text-green-600">
                                        {item.size && <span>Tamaño: {item.size}</span>}
                                        <span>ID: {item.id}</span>
                                      </div>
                                      <div className="mt-2">
                                        <a
                                          href={item.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-xs text-green-600 hover:text-green-800 underline"
                                        >
                                          Ver archivo en Cloudinary
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center py-6 text-gray-500">
                                  <FileText className="mx-auto h-8 w-8 mb-2 text-gray-300" />
                                  <p className="text-sm">
                                    Haz clic en "Subir Archivo" para agregar contenido
                                  </p>
                                  <p className="text-xs mt-1">
                                    Los archivos se subirán automáticamente a Cloudinary
                                  </p>
                                </div>
                              )}
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Info Section */}
                  <TabsContent value="info" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Sección de Información</CardTitle>
                        <CardDescription>
                          Gestiona la información de la urbanización
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="info-title">Título de la Sección</Label>
                            <Input
                              id="info-title"
                              value={content.info.title}
                              onChange={(e) => updateInfo("title", e.target.value)}
                              placeholder="Título de la sección"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="info-description">Descripción</Label>
                            <Input
                              id="info-description"
                              value={content.info.description}
                              onChange={(e) => updateInfo("description", e.target.value)}
                              placeholder="Descripción de la sección"
                            />
                          </div>
                        </div>

                        {/* Imagen Principal */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>Imagen Principal</Label>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700"
                              onClick={() => {
                                const input = document.getElementById(
                                  "info-main-image"
                                ) as HTMLInputElement;
                                if (input) input.click();
                              }}
                            >
                              <Upload className="h-4 w-4 mr-1" />
                              Subir Imagen Principal
                            </Button>
                            <Input
                              id="info-main-image"
                              type="file"
                              accept=".jpg,.jpeg,.png,.gif,.webp"
                              onChange={handleInfoMainImageChange}
                              className="hidden"
                            />
                          </div>

                          {/* Mostrar imagen actual si existe */}
                          {content.info.mainImage && (
                            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                              <div className="flex items-center gap-4">
                                <img
                                  src={content.info.mainImage.url}
                                  alt={content.info.mainImage.title}
                                  className="w-16 h-16 object-cover rounded"
                                />
                                <div className="flex-1">
                                  <p className="font-medium text-sm">
                                    {content.info.mainImage.title}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {content.info.mainImage.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Formulario de subida si hay imagen seleccionada */}
                          {uploadingInfoMainImage?.file && (
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-blue-800">
                                    Imagen: {uploadingInfoMainImage.file?.name}
                                  </p>
                                  <p className="text-xs text-blue-600">
                                    Tipo: {uploadingInfoMainImage.type} • Tamaño:{" "}
                                    {uploadingInfoMainImage.size}
                                  </p>
                                </div>
                                <Button
                                  onClick={cancelInfoMainImageUpload}
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>

                              <div className="space-y-1 mb-2">
                                <Label className="text-xs">Descripción</Label>
                                <Textarea
                                  value={uploadingInfoMainImage.description}
                                  onChange={(e) =>
                                    setUploadingInfoMainImage((prev) => ({
                                      ...prev,
                                      description: e.target.value,
                                    }))
                                  }
                                  placeholder="Descripción de la imagen principal"
                                  rows={2}
                                  className="text-sm"
                                />
                              </div>

                              <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                Se subirá al guardar cambios
                              </div>
                            </div>
                          )}

                          {/* Estado vacío si no hay imagen */}
                          {!content.info.mainImage && !uploadingInfoMainImage?.file && (
                            <div className="text-center py-6 text-gray-500">
                              <Image className="mx-auto h-8 w-8 mb-2 text-gray-300" />
                              <p className="text-sm">
                                Haz clic en "Subir Imagen Principal" para agregar una imagen
                              </p>
                              <p className="text-xs mt-1">
                                Esta imagen se mostrará como imagen principal de la sección
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>Secciones de Información</Label>
                            <Button onClick={addInfoSection} variant="outline" size="sm">
                              Agregar Sección
                            </Button>
                          </div>
                          {content.info.sections.map((section, index) => (
                            <Card key={section.id} className="p-4">
                              <div className="flex items-start justify-between mb-4">
                                <h4 className="font-medium">Sección {index + 1}</h4>
                                <Button
                                  onClick={() => removeInfoSection(section.id)}
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Título</Label>
                                  <Input
                                    value={section.title}
                                    onChange={(e) =>
                                      updateInfoSection(section.id, "title", e.target.value)
                                    }
                                    placeholder="Título de la sección"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Icono</Label>
                                  <Select
                                    value={section.icon}
                                    onValueChange={(value) =>
                                      updateInfoSection(section.id, "icon", value)
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="MapPinHouse">Ubicación</SelectItem>
                                      <SelectItem value="BookText">Texto</SelectItem>
                                      <SelectItem value="UsersRound">Usuarios</SelectItem>
                                      <SelectItem value="BookCopy">Libro</SelectItem>
                                      <SelectItem value="FileText">Documento</SelectItem>
                                      <SelectItem value="Users">Usuarios</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="space-y-2 mt-4">
                                <Label>Descripción</Label>
                                <Textarea
                                  value={section.description}
                                  onChange={(e) =>
                                    updateInfoSection(section.id, "description", e.target.value)
                                  }
                                  placeholder="Descripción de la sección"
                                  rows={3}
                                />
                              </div>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Gallery Section */}
                  <TabsContent value="gallery" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Sección de Galería</CardTitle>
                        <CardDescription>Gestiona las imágenes de la galería</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="gallery-title">Título de la Sección</Label>
                            <Input
                              id="gallery-title"
                              value={content.gallery.title}
                              onChange={(e) => updateGallery("title", e.target.value)}
                              placeholder="Título de la sección"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="gallery-description">Descripción</Label>
                            <Input
                              id="gallery-description"
                              value={content.gallery.description}
                              onChange={(e) => updateGallery("description", e.target.value)}
                              placeholder="Descripción de la sección"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>Imágenes de la Galería</Label>
                            <Button onClick={addGalleryImage} variant="outline" size="sm">
                              Agregar Imagen
                            </Button>
                          </div>
                          {content.gallery.images.map((image, index) => (
                            <Card key={image.id} className="p-4">
                              <div className="flex items-start justify-between mb-4">
                                <h4 className="font-medium">Imagen {index + 1}</h4>
                                <div className="flex gap-2">
                                  {/* Botón de subida de imagen */}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-blue-600 hover:text-blue-700"
                                    onClick={() => {
                                      const input = document.getElementById(
                                        `gallery-image-${image.id}`
                                      ) as HTMLInputElement;
                                      if (input) input.click();
                                    }}
                                  >
                                    <Upload className="h-4 w-4 mr-1" />
                                    Subir Imagen
                                  </Button>
                                  <Input
                                    id={`gallery-image-${image.id}`}
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.gif,.webp"
                                    onChange={(e) => handleGalleryImageChange(image.id, e)}
                                    className="hidden"
                                  />
                                  <Button
                                    onClick={() => removeGalleryImageItem(image.id)}
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              {/* Campos editables del item */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="space-y-2">
                                  <Label>Título de la imagen</Label>
                                  <Input
                                    value={image.title}
                                    onChange={(e) =>
                                      updateGalleryImageItem(image.id, "title", e.target.value)
                                    }
                                    placeholder="Título de la imagen"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Descripción</Label>
                                  <Input
                                    value={image.description || ""}
                                    onChange={(e) =>
                                      updateGalleryImageItem(
                                        image.id,
                                        "description",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Descripción de la imagen"
                                  />
                                </div>
                              </div>

                              {/* Formulario de subida si hay imagen seleccionada */}
                              {uploadingGalleryImages[image.id]?.file && (
                                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-blue-800">
                                        Imagen: {uploadingGalleryImages[image.id].file?.name}
                                      </p>
                                      <p className="text-xs text-blue-600">
                                        Tipo: {uploadingGalleryImages[image.id].type} • Tamaño:{" "}
                                        {uploadingGalleryImages[image.id].size}
                                      </p>
                                    </div>
                                    <Button
                                      onClick={() => cancelGalleryUpload(image.id)}
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>

                                  <div className="space-y-1 mb-2">
                                    <Label className="text-xs">Descripción</Label>
                                    <Textarea
                                      value={uploadingGalleryImages[image.id].description}
                                      onChange={(e) =>
                                        setUploadingGalleryImages((prev) => ({
                                          ...prev,
                                          [image.id]: {
                                            ...prev[image.id],
                                            description: e.target.value,
                                          },
                                        }))
                                      }
                                      placeholder="Descripción de la imagen"
                                      rows={2}
                                      className="text-sm"
                                    />
                                  </div>

                                  <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                    Se subirá al guardar cambios
                                  </div>
                                </div>
                              )}

                              {/* Mostrar datos de la imagen si ya existe */}
                              {image.url && image.url !== "" && !image.url.startsWith("/docs/") ? (
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                  <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                      <img
                                        src={image.url}
                                        alt={image.title}
                                        className="w-16 h-16 object-cover rounded"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between mb-2">
                                        <h5 className="font-medium text-green-800">
                                          {image.title}
                                        </h5>
                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                          IMAGEN
                                        </span>
                                      </div>
                                      {image.description && (
                                        <p className="text-sm text-green-700 mb-2">
                                          {image.description}
                                        </p>
                                      )}
                                      <div className="flex items-center gap-4 text-xs text-green-600">
                                        <span>ID: {image.id}</span>
                                      </div>
                                      <div className="mt-2 flex gap-2">
                                        <a
                                          href={image.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-xs text-green-600 hover:text-green-800 underline"
                                        >
                                          Ver imagen en Cloudinary
                                        </a>
                                        <button
                                          onClick={() => deleteGalleryImage(image.id)}
                                          disabled={deleteGalleryImageMutation.isPending}
                                          className="text-xs text-red-600 hover:text-red-800 underline disabled:opacity-50"
                                        >
                                          {deleteGalleryImageMutation.isPending
                                            ? "Eliminando..."
                                            : "Eliminar"}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center py-6 text-gray-500">
                                  <Image className="mx-auto h-8 w-8 mb-2 text-gray-300" />
                                  <p className="text-sm">
                                    Haz clic en "Subir Imagen" para agregar contenido
                                  </p>
                                  <p className="text-xs mt-1">
                                    Las imágenes se subirán automáticamente a Cloudinary
                                  </p>
                                </div>
                              )}
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
