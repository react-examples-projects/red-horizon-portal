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
import { ArrowLeft, X, Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGetHomeContent, useUpdateHomeContent, HomeContent } from "@/hooks/useHomeContent";

const AdminHome = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Hooks para manejar el contenido del Home
  const { data: homeContent, isLoading: isLoadingContent, error } = useGetHomeContent();
  const updateHomeContentMutation = useUpdateHomeContent();

  const [content, setContent] = useState<HomeContent>({
    hero: {
      title: "Bienvenidos a",
      subtitle: "Aldea Universitaria Base de Misiones Che Guevara",
      description:
        "La Aldea Universitaria Base de Misiones Che Guevara, ubicada en Valle de la Pascua, garantiza el acceso inclusivo a la educación universitaria, formando profesionales comprometidos con el desarrollo local, enmarcados en una ética socialista y el pensamiento bolivariano.",
      primaryButtonText: "Ver Publicaciones",
      secondaryButtonText: "Portal Administrativo",
    },
    features: {
      title: "Formación y Comunidad",
      description:
        "Nuestra Aldea Universitaria trabaja de la mano con las comunidades del sector Padre Chacín y zonas aledañas, promoviendo la organización popular y el desarrollo social.",
      cards: [
        {
          id: "1",
          title: "Servicios / Formación",
          description:
            "La Aldea Universitaria ofrece Programas Nacionales de Formación gratuitos y adaptados a las necesidades del pueblo, con enfoque social y comunitario, formando profesionales comprometidos con el desarrollo local.",
          icon: "BookCopy",
        },
        {
          id: "2",
          title: "Documentos",
          description:
            "Consulta y descarga documentos esenciales como reglamentos, planes de estudio, constancias, calendarios académicos y otros recursos necesarios para el desarrollo académico.",
          icon: "FileText",
        },
        {
          id: "3",
          title: "Comunidad",
          description:
            "La aldea mantiene una estrecha relación con las comunidades vecinas, promoviendo la participación activa en proyectos sociales, culturales y educativos que fortalecen el desarrollo colectivo.",
          icon: "Users",
        },
      ],
    },
    downloads: {
      title: "Archivos y Enlaces",
      description: "Accede a documentos importantes y enlaces útiles para residentes",
      items: [
        {
          id: "1",
          title: "Reglamento de Convivencia 2024",
          description: "Normativas actualizadas para la convivencia en la urbanización",
          type: "pdf",
          url: "/docs/reglamento-2024.pdf",
          size: "2.5 MB",
        },
        {
          id: "2",
          title: "Manual del Propietario",
          description: "Guía completa para nuevos residentes",
          type: "pdf",
          url: "/docs/manual-propietario.pdf",
          size: "1.8 MB",
        },
        {
          id: "3",
          title: "Formulario de Solicitudes",
          description: "Plantilla para solicitudes administrativas",
          type: "word",
          url: "/docs/formulario-solicitudes.docx",
          size: "125 KB",
        },
        {
          id: "4",
          title: "Registro de Visitantes",
          description: "Hoja de cálculo para control de visitas",
          type: "excel",
          url: "/docs/registro-visitantes.xlsx",
          size: "85 KB",
        },
        {
          id: "5",
          title: "Portal de Pagos Online",
          description: "Accede al sistema de pagos de administración",
          type: "link",
          url: "https://pagos.urbanizacion.com",
        },
        {
          id: "6",
          title: "Directorio de Emergencias",
          description: "Números importantes y servicios de emergencia",
          type: "link",
          url: "https://emergencias.urbanizacion.com",
        },
      ],
    },
    info: {
      title: "Información de la Urbanización",
      description: "",
      sections: [
        {
          id: "1",
          title: "Ubicación estratégica",
          description:
            "Está situada al este de Valle de la Pascua, lo que facilita el acceso a la educación para estudiantes de comunidades urbanas y rurales cercanas.",
          icon: "MapPinHouse",
        },
        {
          id: "2",
          title: "Sede educativa",
          description:
            "En esta urbanización se encuentra la sede de la Aldea Universitaria Base de Misiones Che Guevara, específicamente en la E.B.N. Williams Lara, lo que la convierte en un punto clave para la formación universitaria local.",
          icon: "BookText",
        },
        {
          id: "3",
          title: "Apoyo a la inclusión",
          description:
            "Su cercanía y accesibilidad contribuyen significativamente a la inclusión educativa y al ascenso social de los bachilleres de la zona.",
          icon: "UsersRound",
        },
      ],
    },
    gallery: {
      title: "Galería de Nuestra Urbanización",
      description:
        "La Urbanización Padre Chacín se ubica al este de Valle de la Pascua, Estado Guárico. Es una comunidad residencial que cuenta con servicios básicos, espacios deportivos y educativos.",
      images: [
        {
          id: "1",
          url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
          title: "Entrada Principal",
          description: "Vista de la entrada principal de la urbanización",
        },
        {
          id: "2",
          url: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&h=400&fit=crop",
          title: "Área de Seguridad",
          description: "Caseta de vigilancia 24/7",
        },
        {
          id: "3",
          url: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=600&h=400&fit=crop",
          title: "Jardines",
          description: "Espacios verdes y áreas de recreación",
        },
        {
          id: "4",
          url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop",
          title: "Áreas Comunes",
          description: "Salón de eventos y reuniones",
        },
        {
          id: "5",
          url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
          title: "Parque Infantil",
          description: "Área de juegos para niños",
        },
        {
          id: "6",
          url: "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=600&h=400&fit=crop",
          title: "Piscina Comunitaria",
          description: "Área de piscina y recreación acuática",
        },
      ],
    },
  });

  // Cargar contenido cuando se obtiene del servidor
  useEffect(() => {
    if (homeContent) {
      setContent(homeContent);
    }
  }, [homeContent]);

  const handleSave = async () => {
    try {
      await updateHomeContentMutation.mutateAsync(content);

      toast({
        title: "Contenido guardado",
        description: "Los cambios han sido guardados exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al guardar los cambios",
        variant: "destructive",
      });
    }
  };

  const updateHero = (field: keyof HomeContent["hero"], value: string) => {
    setContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }));
  };

  const updateFeatures = (field: keyof HomeContent["features"], value: string) => {
    setContent((prev) => ({
      ...prev,
      features: { ...prev.features, [field]: value },
    }));
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
            url: "/docs/nuevo-archivo.pdf",
            size: "1 MB",
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

  const updateGalleryImage = (id: string, field: string, value: string) => {
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
    const newId = (content.gallery.images.length + 1).toString();
    setContent((prev) => ({
      ...prev,
      gallery: {
        ...prev.gallery,
        images: [
          ...prev.gallery.images,
          {
            id: newId,
            url: "https://via.placeholder.com/600x400",
            title: "Nueva imagen",
            description: "Descripción de la nueva imagen",
          },
        ],
      },
    }));
  };

  const removeGalleryImage = (id: string) => {
    setContent((prev) => ({
      ...prev,
      gallery: {
        ...prev.gallery,
        images: prev.gallery.images.filter((image) => image.id !== id),
      },
    }));
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
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Administrar Página Home</h1>
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
                    <CardDescription>Configura el contenido principal de la página</CardDescription>
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
                                onValueChange={(value) => updateFeatureCard(card.id, "icon", value)}
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
                    <CardDescription>Gestiona los archivos y enlaces descargables</CardDescription>
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
                            <Button
                              onClick={() => removeDownloadItem(item.id)}
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
                                value={item.title}
                                onChange={(e) =>
                                  updateDownloadItem(item.id, "title", e.target.value)
                                }
                                placeholder="Título del elemento"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Tipo</Label>
                              <Select
                                value={item.type}
                                onValueChange={(value) =>
                                  updateDownloadItem(item.id, "type", value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pdf">PDF</SelectItem>
                                  <SelectItem value="word">Word</SelectItem>
                                  <SelectItem value="excel">Excel</SelectItem>
                                  <SelectItem value="link">Enlace</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-2">
                              <Label>URL</Label>
                              <Input
                                value={item.url}
                                onChange={(e) => updateDownloadItem(item.id, "url", e.target.value)}
                                placeholder="URL del archivo o enlace"
                              />
                            </div>
                            {item.type !== "link" && (
                              <div className="space-y-2">
                                <Label>Tamaño</Label>
                                <Input
                                  value={item.size || ""}
                                  onChange={(e) =>
                                    updateDownloadItem(item.id, "size", e.target.value)
                                  }
                                  placeholder="Tamaño del archivo"
                                />
                              </div>
                            )}
                          </div>
                          <div className="space-y-2 mt-4">
                            <Label>Descripción</Label>
                            <Textarea
                              value={item.description}
                              onChange={(e) =>
                                updateDownloadItem(item.id, "description", e.target.value)
                              }
                              placeholder="Descripción del elemento"
                              rows={2}
                            />
                          </div>
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
                    <CardDescription>Gestiona la información de la urbanización</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="info-title">Título de la Sección</Label>
                      <Input
                        id="info-title"
                        value={content.info.title}
                        onChange={(e) => updateInfo("title", e.target.value)}
                        placeholder="Título de la sección"
                      />
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {content.gallery.images.map((image, index) => (
                          <Card key={image.id} className="p-4">
                            <div className="flex items-start justify-between mb-4">
                              <h4 className="font-medium">Imagen {index + 1}</h4>
                              <Button
                                onClick={() => removeGalleryImage(image.id)}
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>URL de la Imagen</Label>
                                <Input
                                  value={image.url}
                                  onChange={(e) =>
                                    updateGalleryImage(image.id, "url", e.target.value)
                                  }
                                  placeholder="URL de la imagen"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Título</Label>
                                <Input
                                  value={image.title}
                                  onChange={(e) =>
                                    updateGalleryImage(image.id, "title", e.target.value)
                                  }
                                  placeholder="Título de la imagen"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Descripción</Label>
                                <Textarea
                                  value={image.description}
                                  onChange={(e) =>
                                    updateGalleryImage(image.id, "description", e.target.value)
                                  }
                                  placeholder="Descripción de la imagen"
                                  rows={2}
                                />
                              </div>
                              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                  src={image.url}
                                  alt={image.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = "/placeholder.svg";
                                  }}
                                />
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
