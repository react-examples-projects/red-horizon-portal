
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { Publication } from "@/types/Publication";
import { Plus, Edit, Trash2, Eye, FileText, Users, Calendar, TrendingUp, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [filteredPublications, setFilteredPublications] = useState<Publication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDateFilter, setSelectedDateFilter] = useState("all");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Simulación de datos de publicaciones
    const mockPublications: Publication[] = [
      {
        id: "1",
        title: "Nuevo Reglamento de Convivencia 2024",
        description: "Se ha actualizado el reglamento de conv...",
        category: "general",
        author: "Administración",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z"
      },
      {
        id: "2",
        title: "Mantenimiento del Sistema Eléctrico",
        description: "Programado corte de energía eléctrica...",
        category: "mantenimiento",
        author: "Comité de Mantenimiento",
        createdAt: "2024-01-20T14:30:00Z",
        updatedAt: "2024-01-20T14:30:00Z"
      },
      {
        id: "3",
        title: "Celebración Día de la Familia",
        description: "Los invitamos a participar en la cele...",
        category: "eventos",
        author: "Comité Social",
        createdAt: "2024-01-18T16:00:00Z",
        updatedAt: "2024-01-18T16:00:00Z"
      }
    ];
    
    setPublications(mockPublications);
    setFilteredPublications(mockPublications);
  }, [isAuthenticated, navigate]);

  // Filtrar publicaciones
  useEffect(() => {
    let filtered = publications;

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(pub => 
        pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (selectedCategory !== "all") {
      filtered = filtered.filter(pub => pub.category === selectedCategory);
    }

    // Filtrar por fecha
    if (selectedDateFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();
      
      switch (selectedDateFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(pub => new Date(pub.createdAt) >= filterDate);
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(pub => new Date(pub.createdAt) >= filterDate);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(pub => new Date(pub.createdAt) >= filterDate);
          break;
      }
    }

    setFilteredPublications(filtered);
  }, [publications, searchTerm, selectedCategory, selectedDateFilter]);

  const handleDeletePublication = (id: string) => {
    setPublications(publications.filter(pub => pub.id !== id));
    toast({
      title: "Publicación eliminada",
      description: "La publicación ha sido eliminada exitosamente",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'general': 'bg-blue-100 text-blue-700',
      'mantenimiento': 'bg-green-100 text-green-700',
      'seguridad': 'bg-red-100 text-red-700',
      'eventos': 'bg-purple-100 text-purple-700',
      'avisos': 'bg-orange-100 text-orange-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const categories = [
    { value: "all", label: "Todas las categorías" },
    { value: "general", label: "General" },
    { value: "mantenimiento", label: "Mantenimiento" },
    { value: "seguridad", label: "Seguridad" },
    { value: "eventos", label: "Eventos" },
    { value: "avisos", label: "Avisos" }
  ];

  const dateFilters = [
    { value: "all", label: "Todas las fechas" },
    { value: "today", label: "Hoy" },
    { value: "week", label: "Última semana" },
    { value: "month", label: "Último mes" }
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel Administrativo</h1>
          <p className="text-gray-600">Bienvenido, {user?.email} - Gestiona el contenido de la comunidad</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total Publicaciones</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{publications.length}</div>
              <p className="text-xs text-blue-600">+2 este mes</p>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Usuarios Registrados</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">248</div>
              <p className="text-xs text-green-600">+12 este mes</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Eventos Programados</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">5</div>
              <p className="text-xs text-purple-600">próximos 30 días</p>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Visualizaciones</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">1,234</div>
              <p className="text-xs text-red-600">+18% vs mes anterior</p>
            </CardContent>
          </Card>
        </div>

        {/* Publications Management */}
        <Card className="border-red-100">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-red-700">Gestión de Publicaciones</CardTitle>
                <CardDescription>Administra las publicaciones de la comunidad</CardDescription>
              </div>
              <Link to="/admin/crear-publicacion">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Publicación
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar publicaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-red-200 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 border-red-200 focus:ring-red-500 focus:border-red-500">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedDateFilter} onValueChange={setSelectedDateFilter}>
                  <SelectTrigger className="w-44 border-red-200 focus:ring-red-500 focus:border-red-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dateFilters.map((filter) => (
                      <SelectItem key={filter.value} value={filter.value}>
                        {filter.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredPublications.length > 0 ? (
                filteredPublications.map((publication) => (
                  <div
                    key={publication.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{publication.title}</h3>
                        <Badge className={getCategoryColor(publication.category)}>
                          {publication.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{publication.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Por: {publication.author}</span>
                        <span>Creado: {formatDate(publication.createdAt)}</span>
                        <span>Actualizado: {formatDate(publication.updatedAt)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Link to={`/admin/editar-publicacion/${publication.id}`}>
                        <Button size="sm" variant="outline" className="border-green-200 text-green-600 hover:bg-green-50">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeletePublication(publication.id)}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron publicaciones</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || selectedCategory !== "all" || selectedDateFilter !== "all" 
                      ? "Intenta ajustar los filtros de búsqueda"
                      : "Comienza creando tu primera publicación"
                    }
                  </p>
                  <Link to="/admin/crear-publicacion">
                    <Button className="bg-red-600 hover:bg-red-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Primera Publicación
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
