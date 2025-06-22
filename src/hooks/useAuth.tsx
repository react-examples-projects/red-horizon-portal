
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'editor';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Verificar si hay un token guardado en localStorage
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulación de autenticación - En producción, esto sería una llamada a la API
      if (email === 'admin@urbanizacion.com' && password === 'admin123') {
        const userData: User = {
          id: '1',
          email: email,
          role: 'admin'
        };
        
        setUser(userData);
        localStorage.setItem('auth_token', 'fake-jwt-token');
        localStorage.setItem('user_data', JSON.stringify(userData));
        return true;
      } else if (email === 'editor@urbanizacion.com' && password === 'editor123') {
        const userData: User = {
          id: '2',
          email: email,
          role: 'editor'
        };
        
        setUser(userData);
        localStorage.setItem('auth_token', 'fake-jwt-token');
        localStorage.setItem('user_data', JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
