import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PublicationCard } from "@/components/PublicationCard";
import { ImageGallery } from "@/components/ImageGallery";
import { DownloadSection } from "@/components/DownloadSection";
import { Navbar } from "@/components/Navbar";
import { Publication } from "@/types/Publication";
import { ArrowRight, Shield, Users, Bell, FileText, Images, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [featuredPublications, setFeaturedPublications] = useState<Publication[]>([]);

  // Datos para la galería
  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
      title: "Entrada Principal",
      description: "Vista de la entrada principal de la urbanización"
    },
    {
      url: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&h=400&fit=crop",
      title: "Área de Seguridad",
      description: "Caseta de vigilancia 24/7"
    },
    {
      url: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=600&h=400&fit=crop",
      title: "Jardines",
      description: "Espacios verdes y áreas de recreación"
    },
    {
      url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop",
      title: "Áreas Comunes",
      description: "Salón de eventos y reuniones"
    },
    {
      url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
      title: "Parque Infantil",
      description: "Área de juegos para niños"
    },
    {
      url: "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=600&h=400&fit=crop",
      title: "Piscina Comunitaria",
      description: "Área de piscina y recreación acuática"
    }
  ];

  // Datos para archivos y enlaces
  const downloadItems = [
    {
      id: "1",
      title: "Reglamento de Convivencia 2024",
      description: "Normativas actualizadas para la convivencia en la urbanización",
      type: "pdf" as const,
      url: "/docs/reglamento-2024.pdf",
      size: "2.5 MB"
    },
    {
      id: "2",
      title: "Manual del Propietario",
      description: "Guía completa para nuevos residentes",
      type: "pdf" as const,
      url: "/docs/manual-propietario.pdf",
      size: "1.8 MB"
    },
    {
      id: "3",
      title: "Formulario de Solicitudes",
      description: "Plantilla para solicitudes administrativas",
      type: "word" as const,
      url: "/docs/formulario-solicitudes.docx",
      size: "125 KB"
    },
    {
      id: "4",
      title: "Registro de Visitantes",
      description: "Hoja de cálculo para control de visitas",
      type: "excel" as const,
      url: "/docs/registro-visitantes.xlsx",
      size: "85 KB"
    },
    {
      id: "5",
      title: "Portal de Pagos Online",
      description: "Accede al sistema de pagos de administración",
      type: "link" as const,
      url: "https://pagos.urbanizacion.com"
    },
    {
      id: "6",
      title: "Directorio de Emergencias",
      description: "Números importantes y servicios de emergencia",
      type: "link" as const,
      url: "https://emergencias.urbanizacion.com"
    }
  ];

  useEffect(() => {
    // Simulación de datos de publicaciones destacadas
    const mockPublications: Publication[] = [
      {
        id: "1",
        title: "Nuevo Reglamento de Convivencia 2024",
        description: "Se ha actualizado el reglamento de convivencia con nuevas normas para el uso de áreas comunes y horarios de visitas.",
        category: "general",
        author: "Administración",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
        attachments: [
          {
            name: "Reglamento_Convivencia_2024.pdf",
            url: "/docs/reglamento.pdf",
            type: "PDF",
            size: 2048000
          }
        ]
      },
      {
        id: "2",
        title: "Mantenimiento del Sistema Eléctrico",
        description: "Programado corte de energía eléctrica el próximo viernes 26 de enero de 8:00 AM a 12:00 PM para mantenimiento preventivo.",
        category: "mantenimiento",
        author: "Comité de Mantenimiento",
        createdAt: "2024-01-20T14:30:00Z",
        updatedAt: "2024-01-20T14:30:00Z",
        images: [
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop"
        ]
      },
      {
        id: "3",
        title: "Celebración Día de la Familia",
        description: "Los invitamos a participar en la celebración del Día de la Familia que se realizará el próximo domingo en el área recreativa.",
        category: "eventos",
        author: "Comité Social",
        createdAt: "2024-01-18T16:00:00Z",
        updatedAt: "2024-01-18T16:00:00Z",
        images: [
          "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop"
        ]
      }
    ];
    setFeaturedPublications(mockPublications);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <Navbar />
      
      {/* Hero Section con gradiente mejorado */}
      <section className="relative bg-gradient-red text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-slide-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 font-inter">
              Bienvenidos a
              <span className="block text-red-100 font-light">Portal Residencial</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-red-50 max-w-3xl mx-auto font-light leading-relaxed">
              Tu comunidad conectada. Mantente informado sobre noticias, eventos y servicios de nuestra urbanización.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/publicaciones">
                <Button size="lg" className="btn-gradient text-white border-0 text-lg px-10 py-4 rounded-full font-medium shadow-lg">
                  Ver Publicaciones
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm text-lg px-10 py-4 rounded-full font-medium">
                  Portal Administrativo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 font-inter">Servicios Disponibles</h2>
            <p className="text-xl text-gray-600 font-light">Todo lo que necesitas para una mejor convivencia</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-300 border-red-100 hover:border-red-200 group">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-red rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Bell className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-red-700 text-xl font-semibold">Avisos Importantes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Mantente informado sobre avisos, mantenimientos y eventos importantes de la comunidad.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-red-100 hover:border-red-200 group">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-red rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-red-700 text-xl font-semibold">Documentos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Accede a reglamentos, actas de reuniones y documentos importantes de la administración.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-red-100 hover:border-red-200 group">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-red rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-red-700 text-xl font-semibold">Comunidad</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Participa en eventos, conoce a tus vecinos y fortalece los lazos comunitarios.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 font-inter">Archivos y Enlaces</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">Accede a documentos importantes y enlaces útiles para residentes</p>
          </div>
          <DownloadSection items={downloadItems} />
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8 font-inter">Información de la Urbanización</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-red rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">Seguridad 24/7</h3>
                    <p className="text-gray-600 leading-relaxed">Vigilancia continua para tu tranquilidad y la de tu familia.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-red rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">Eventos Regulares</h3>
                    <p className="text-gray-600 leading-relaxed">Actividades familiares y comunitarias durante todo el año.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-red rounded-xl flex items-center justify-center flex-shrink-0">
                    <Images className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">Áreas Recreativas</h3>
                    <p className="text-gray-600 leading-relaxed">Espacios verdes, parques infantiles y áreas deportivas.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <img
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop"
                alt="Área recreativa"
                className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
              <img
                src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&h=300&fit=crop"
                alt="Seguridad"
                className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=400&h=300&fit=crop"
                alt="Jardines"
                className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 -mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop"
                alt="Áreas comunes"
                className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 font-inter">Galería de Nuestra Urbanización</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">Conoce nuestras instalaciones y espacios diseñados para tu comodidad y bienestar</p>
          </div>
          <ImageGallery images={galleryImages} />
        </div>
      </section>

      {/* Featured Publications Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4 font-inter">Publicaciones Recientes</h2>
              <p className="text-xl text-gray-600 font-light">Las últimas noticias de nuestra comunidad</p>
            </div>
            <Link to="/publicaciones">
              <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 rounded-full px-6">
                Ver todas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPublications.map((publication) => (
              <PublicationCard key={publication.id} publication={publication} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-red-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-6 font-inter">Portal Residencial</h3>
            <p className="text-red-100 mb-8 text-lg font-light">Conectando nuestra comunidad</p>
            <div className="text-sm text-red-200">
              © 2024 Portal Residencial. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
