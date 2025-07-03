import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageGallery } from "@/components/ImageGallery";
import { DownloadSection } from "@/components/DownloadSection";
import { Navbar } from "@/components/Navbar";
import PublicationCarousel from "@/components/PublicationCarousel";
import { useGetLatestPosts } from "@/hooks/usePosts";
import { useGetHomeContent } from "@/hooks/useHomeContent";
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
import { Loader2 } from "lucide-react";

const ICONS: Record<string, any> = {
  BookCopy,
  FileText,
  Users,
  MapPinHouse,
  BookText,
  UsersRound,
};

const Index = () => {
  // Hook para obtener las últimas publicaciones
  const { data: latestPostsData, isLoading: isLoadingPosts } = useGetLatestPosts(10);
  const latestPublications = latestPostsData?.posts || [];

  // Hook para obtener el contenido dinámico del Home
  const { data: homeContent, isLoading: isLoadingHome, error } = useGetHomeContent();

  if (isLoadingHome) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-red-600" />
        <span className="ml-4 text-lg text-gray-700">Cargando página principal...</span>
      </div>
    );
  }

  if (error || !homeContent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <span className="text-2xl text-red-600 font-bold mb-4">Error al cargar el contenido</span>
        <Button onClick={() => window.location.reload()} className="bg-red-600 text-white">
          Reintentar
        </Button>
      </div>
    );
  }

  // Desestructuramos el contenido del backend
  const { hero, features, downloads, info, gallery } = homeContent;

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-red text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-slide-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 font-inter">
              {hero.title}
              <span className="block text-red-100 font-light">{hero.subtitle}</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-red-50 max-w-3xl mx-auto font-light leading-relaxed">
              {hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/publicaciones-publicas">
                <Button
                  size="lg"
                  className=" bg-red-500 text-white border-0 text-lg px-10 py-4 rounded-full font-medium shadow-lg"
                >
                  {hero.primaryButtonText}
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-black backdrop-blur-sm text-lg px-10 py-4 rounded-full font-medium"
                >
                  {hero.secondaryButtonText}
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
            <h2 className="text-4xl font-bold text-gray-900 mb-6 font-inter">{features.title}</h2>
            <p className="text-xl text-gray-600 font-light">{features.description}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.cards.map((card) => {
              const Icon = ICONS[card.icon] || FileText;
              return (
                <Card
                  key={card.id}
                  className="text-center hover:shadow-xl transition-all duration-300 border-red-100 hover:border-red-200 group"
                >
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-gradient-red rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-red-700 text-xl font-semibold">
                      {card.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {card.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 font-inter">{downloads.title}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              {downloads.description}
            </p>
          </div>
          <DownloadSection items={downloads.items} />
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8 font-inter">{info.title}</h2>
              <div className="space-y-8">
                {info.sections.map((section) => {
                  const Icon = ICONS[section.icon] || FileText;
                  return (
                    <div className="flex items-start gap-4" key={section.id}>
                      <div className="w-12 h-12 bg-gradient-red rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg mb-2">
                          {section.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">{section.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {gallery.images.slice(0, 4).map((img, idx) => (
                <img
                  key={img.id}
                  src={img.url}
                  alt={img.title}
                  className={`rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                    idx === 1 ? "mt-8" : ""
                  } ${idx === 2 ? "-mt-8" : ""}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 font-inter">{gallery.title}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light mb-3">
              {gallery.description}
            </p>
          </div>
          <ImageGallery images={gallery.images} />
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
