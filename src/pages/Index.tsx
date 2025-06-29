import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageGallery } from "@/components/ImageGallery";
import { DownloadSection } from "@/components/DownloadSection";
import { Navbar } from "@/components/Navbar";
import PublicationCarousel from "@/components/PublicationCarousel";
import { useGetLatestPosts } from "@/hooks/usePosts";
import {
  ArrowRight,
  MapPinHouse,
  Users,
  BookCopy,
  FileText,
  UsersRound,
  BookText,
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  // Hook para obtener las últimas publicaciones
  const { data: latestPostsData, isLoading: isLoadingPosts } = useGetLatestPosts(10);
  const latestPublications = latestPostsData?.posts || [];

  // Datos para la galería
  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
      title: "Entrada Principal",
      description: "Vista de la entrada principal de la urbanización",
    },
    {
      url: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&h=400&fit=crop",
      title: "Área de Seguridad",
      description: "Caseta de vigilancia 24/7",
    },
    {
      url: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=600&h=400&fit=crop",
      title: "Jardines",
      description: "Espacios verdes y áreas de recreación",
    },
    {
      url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop",
      title: "Áreas Comunes",
      description: "Salón de eventos y reuniones",
    },
    {
      url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
      title: "Parque Infantil",
      description: "Área de juegos para niños",
    },
    {
      url: "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=600&h=400&fit=crop",
      title: "Piscina Comunitaria",
      description: "Área de piscina y recreación acuática",
    },
  ];

  // Datos para archivos y enlaces
  const downloadItems = [
    {
      id: "1",
      title: "Reglamento de Convivencia 2024",
      description: "Normativas actualizadas para la convivencia en la urbanización",
      type: "pdf" as const,
      url: "/docs/reglamento-2024.pdf",
      size: "2.5 MB",
    },
    {
      id: "2",
      title: "Manual del Propietario",
      description: "Guía completa para nuevos residentes",
      type: "pdf" as const,
      url: "/docs/manual-propietario.pdf",
      size: "1.8 MB",
    },
    {
      id: "3",
      title: "Formulario de Solicitudes",
      description: "Plantilla para solicitudes administrativas",
      type: "word" as const,
      url: "/docs/formulario-solicitudes.docx",
      size: "125 KB",
    },
    {
      id: "4",
      title: "Registro de Visitantes",
      description: "Hoja de cálculo para control de visitas",
      type: "excel" as const,
      url: "/docs/registro-visitantes.xlsx",
      size: "85 KB",
    },
    {
      id: "5",
      title: "Portal de Pagos Online",
      description: "Accede al sistema de pagos de administración",
      type: "link" as const,
      url: "https://pagos.urbanizacion.com",
    },
    {
      id: "6",
      title: "Directorio de Emergencias",
      description: "Números importantes y servicios de emergencia",
      type: "link" as const,
      url: "https://emergencias.urbanizacion.com",
    },
  ];

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
              <span className="block text-red-100 font-light">
                Aldea Universitaria Base de Misiones Che Guevara
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-red-50 max-w-3xl mx-auto font-light leading-relaxed">
              La Aldea Universitaria Base de Misiones Che Guevara, ubicada en Valle de la Pascua,
              garantiza el acceso inclusivo a la educación universitaria, formando profesionales
              comprometidos con el desarrollo local, enmarcados en una ética socialista y el
              pensamiento bolivariano.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/publicaciones-publicas">
                <Button
                  size="lg"
                  className=" bg-red-500 text-white border-0 text-lg px-10 py-4 rounded-full font-medium shadow-lg"
                >
                  Ver Publicaciones
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-black backdrop-blur-sm text-lg px-10 py-4 rounded-full font-medium"
                >
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
            <h2 className="text-4xl font-bold text-gray-900 mb-6 font-inter">
              Formación y Comunidad
            </h2>
            <p className="text-xl text-gray-600 font-light">
              Nuestra Aldea Universitaria trabaja de la mano con las comunidades del sector Padre
              Chacín y zonas aledañas, promoviendo la organización popular y el desarrollo social.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-300 border-red-100 hover:border-red-200 group">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-red rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BookCopy className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-red-700 text-xl font-semibold">
                  Servicios / Formación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  La Aldea Universitaria ofrece Programas Nacionales de Formación gratuitos y
                  adaptados a las necesidades del pueblo, con enfoque social y comunitario, formando
                  profesionales comprometidos con el desarrollo local.
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
                  Consulta y descarga documentos esenciales como reglamentos, planes de estudio,
                  constancias, calendarios académicos y otros recursos necesarios para el desarrollo
                  académico.
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
                  La aldea mantiene una estrecha relación con las comunidades vecinas, promoviendo
                  la participación activa en proyectos sociales, culturales y educativos que
                  fortalecen el desarrollo colectivo.
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
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              Accede a documentos importantes y enlaces útiles para residentes
            </p>
          </div>
          <DownloadSection items={downloadItems} />
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8 font-inter">
                Información de la Urbanización
              </h2>
              <div className="space-y-8">
                <p className="text-lg text-gray-600 leading-relaxed">
                  La Urbanización Padre Chacín es una zona residencial de fácil acceso en Valle de
                  la Pascua, que alberga la sede de la aldea, facilitando el acceso a la educación
                  superior a jóvenes y adultos de sectores urbanos y rurales.
                </p>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-red rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPinHouse className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">
                      Ubicación estratégica
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Está situada al este de Valle de la Pascua, lo que facilita el acceso a la
                      educación para estudiantes de comunidades urbanas y rurales cercanas.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-red rounded-xl flex items-center justify-center flex-shrink-0">
                    <BookText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">Sede educativa</h3>
                    <p className="text-gray-600 leading-relaxed">
                      En esta urbanización se encuentra la sede de la Aldea Universitaria Base de
                      Misiones Che Guevara, específicamente en la E.B.N. Williams Lara, lo que la
                      convierte en un punto clave para la formación universitaria local.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-red rounded-xl flex items-center justify-center flex-shrink-0">
                    <UsersRound className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">
                      Apoyo a la inclusión
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Su cercanía y accesibilidad contribuyen significativamente a la inclusión
                      educativa y al ascenso social de los bachilleres de la zona.
                    </p>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-6 font-inter">
              Galería de Nuestra Urbanización
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light mb-3">
              La Urbanización Padre Chacín se ubica al este de Valle de la Pascua, Estado Guárico.
              Es una comunidad residencial que cuenta con servicios básicos, espacios deportivos y
              educativos.
            </p>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              Su ubicación estratégica permite el fácil acceso a la Aldea Universitaria Base de
              Misiones Che Guevara, beneficiando a jóvenes y adultos de sectores vecinos, tanto
              urbanos como rurales. Esta comunidad es ejemplo de organización y participación
              ciudadana, y ha sido clave en el impulso de proyectos educativos y sociales en la
              zona.
            </p>
          </div>
          <ImageGallery images={galleryImages} />
        </div>
      </section>

      {/* Featured Publications Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4 font-inter">
                Publicaciones Recientes
              </h2>
              <p className="text-xl text-gray-600 font-light">
                Las últimas noticias de nuestra comunidad
              </p>
            </div>
            <Link to="/publicaciones-publicas">
              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 rounded-full px-6"
              >
                Ver todas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <PublicationCarousel publications={latestPublications} isLoading={isLoadingPosts} />
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
