
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PublicationCard } from "@/components/PublicationCard";
import { Navbar } from "@/components/Navbar";
import { Publication } from "@/types/Publication";
import { ArrowRight, Shield, Users, Bell, FileText, Images, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [featuredPublications, setFeaturedPublications] = useState<Publication[]>([]);

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-600 via-red-500 to-red-700 text-white py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-slide-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Bienvenidos a
              <span className="block text-red-100">Portal Residencial</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-red-100 max-w-3xl mx-auto">
              Tu comunidad conectada. Mantente informado sobre noticias, eventos y servicios de nuestra urbanización.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/publicaciones">
                <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 text-lg px-8">
                  Ver Publicaciones
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8">
                  Portal Administrativo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Servicios Disponibles</h2>
            <p className="text-lg text-gray-600">Todo lo que necesitas para una mejor convivencia</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow border-red-100">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Bell className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-red-700">Avisos Importantes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Mantente informado sobre avisos, mantenimientos y eventos importantes de la comunidad.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-red-100">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-red-700">Documentos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Accede a reglamentos, actas de reuniones y documentos importantes de la administración.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-red-100">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-red-700">Comunidad</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Participa en eventos, conoce a tus vecinos y fortalece los lazos comunitarios.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Publications Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Publicaciones Recientes</h2>
              <p className="text-gray-600">Las últimas noticias de nuestra comunidad</p>
            </div>
            <Link to="/publicaciones">
              <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                Ver todas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPublications.map((publication) => (
              <PublicationCard key={publication.id} publication={publication} />
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Información de la Urbanización</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-red-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Seguridad 24/7</h3>
                    <p className="text-gray-600">Vigilancia continua para tu tranquilidad y la de tu familia.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-red-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Eventos Regulares</h3>
                    <p className="text-gray-600">Actividades familiares y comunitarias durante todo el año.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Images className="h-5 w-5 text-red-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Áreas Recreativas</h3>
                    <p className="text-gray-600">Espacios verdes, parques infantiles y áreas deportivas.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop"
                alt="Área recreativa"
                className="rounded-lg shadow-md"
              />
              <img
                src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&h=300&fit=crop"
                alt="Seguridad"
                className="rounded-lg shadow-md"
              />
              <img
                src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=400&h=300&fit=crop"
                alt="Jardines"
                className="rounded-lg shadow-md"
              />
              <img
                src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop"
                alt="Áreas comunes"
                className="rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-red-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Portal Residencial</h3>
            <p className="text-red-200 mb-6">Conectando nuestra comunidad</p>
            <div className="text-sm text-red-300">
              © 2024 Portal Residencial. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
