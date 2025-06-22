
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { PublicationCard } from "@/components/PublicationCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Publication } from "@/types/Publication";
import { Search, Filter } from "lucide-react";

const Publications = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [filteredPublications, setFilteredPublications] = useState<Publication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { value: "all", label: "Todas las categorías" },
    { value: "general", label: "General" },
    { value: "mantenimiento", label: "Mantenimiento" },
    { value: "seguridad", label: "Seguridad" },
    { value: "eventos", label: "Eventos" },
    { value: "avisos", label: "Avisos" }
  ];

  useEffect(() => {
    // Simulación de datos de publicaciones
    const mockPublications: Publication[] = [
      {
        id: "1",
        title: "Nuevo Reglamento de Convivencia 2024",
        description: "Se ha actualizado el reglamento de convivencia con nuevas normas para el uso de áreas comunes y horarios de visitas. Este documento contiene información importante sobre las nuevas políticas de la urbanización.",
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
        description: "Programado corte de energía eléctrica el próximo viernes 26 de enero de 8:00 AM a 12:00 PM para mantenimiento preventivo del sistema eléctrico principal.",
        category: "mantenimiento",
        author: "Comité de Mantenimiento",
        createdAt: "2024-01-20T14:30:00Z",
        updatedAt: "2024-01-20T14:30:00Z",
        images: [
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop"
        ]
      },
      {
        id: "3",
        title: "Celebración Día de la Familia",
        description: "Los invitamos a participar en la celebración del Día de la Familia que se realizará el próximo domingo en el área recreativa. Habrá actividades para toda la familia.",
        category: "eventos",
        author: "Comité Social",
        createdAt: "2024-01-18T16:00:00Z",
        updatedAt: "2024-01-18T16:00:00Z",
        images: [
          "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop",
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop"
        ]
      },
      {
        id: "4",
        title: "Refuerzo de Seguridad Nocturna",
        description: "A partir del próximo mes, se implementará un refuerzo en el servicio de seguridad nocturna con rondas adicionales cada 2 horas.",
        category: "seguridad",
        author: "Jefe de Seguridad",
        createdAt: "2024-01-22T09:15:00Z",
        updatedAt: "2024-01-22T09:15:00Z"
      },
      {
        id: "5",
        title: "Reunión Extraordinaria de Propietarios",
        description: "Se convoca a reunión extraordinaria de propietarios para el día 15 de febrero a las 7:00 PM en el salón comunal para discutir temas importantes.",
        category: "avisos",
        author: "Administración",
        createdAt: "2024-01-25T11:00:00Z",
        updatedAt: "2024-01-25T11:00:00Z",
        attachments: [
          {
            name: "Agenda_Reunion_Extraordinaria.pdf",
            url: "/docs/agenda.pdf",
            type: "PDF",
            size: 1024000
          }
        ]
      },
      {
        id: "6",
        title: "Limpieza de Tanques de Agua",
        description: "Se realizará la limpieza y desinfección de los tanques de agua potable. Durante este proceso podrá haber interrupciones menores en el servicio.",
        category: "mantenimiento",
        author: "Comité de Mantenimiento",
        createdAt: "2024-01-28T13:45:00Z",
        updatedAt: "2024-01-28T13:45:00Z"
      }
    ];
    
    setPublications(mockPublications);
    setFilteredPublications(mockPublications);
  }, []);

  useEffect(() => {
    let filtered = publications;

    // Filtrar por categoría
    if (selectedCategory !== "all") {
      filtered = filtered.filter(pub => pub.category === selectedCategory);
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(pub =>
        pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPublications(filtered);
  }, [publications, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Publicaciones</h1>
          <p className="text-gray-600">Mantente informado sobre las últimas noticias y eventos de la comunidad</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-red-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar publicaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-red-200 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
            <div className="md:w-64">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="border-red-200 focus:ring-red-500 focus:border-red-500">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Mostrando {filteredPublications.length} de {publications.length} publicaciones
            {selectedCategory !== "all" && (
              <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-sm rounded-full">
                {categories.find(c => c.value === selectedCategory)?.label}
              </span>
            )}
          </p>
        </div>

        {/* Publications Grid */}
        {filteredPublications.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPublications.map((publication) => (
              <PublicationCard 
                key={publication.id} 
                publication={publication}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron publicaciones</h3>
              <p>Intenta cambiar los filtros o términos de búsqueda</p>
            </div>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Publications;
