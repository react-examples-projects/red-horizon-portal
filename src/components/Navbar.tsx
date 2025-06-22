
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, User, LogOut, Settings, FileText } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b-2 border-red-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Portal Residencial</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-red-100 text-red-700' 
                  : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              Inicio
            </Link>
            
            <Link
              to="/publicaciones"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/publicaciones') 
                  ? 'bg-red-100 text-red-700' 
                  : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              Publicaciones
            </Link>

            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/admin') 
                      ? 'bg-red-100 text-red-700' 
                      : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  <Settings className="h-4 w-4 inline mr-1" />
                  Panel Admin
                </Link>
                
                <span className="text-sm text-gray-600">
                  Hola, {user.email}
                </span>
                
                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Salir
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                    <User className="h-4 w-4 mr-1" />
                    Iniciar Sesión
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
