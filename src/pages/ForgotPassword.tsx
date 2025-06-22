
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navbar } from "@/components/Navbar";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulación de envío de correo
    setTimeout(() => {
      setIsLoading(false);
      setIsEmailSent(true);
      toast({
        title: "Correo enviado",
        description: "Revisa tu bandeja de entrada para restablecer tu contraseña",
      });
    }, 2000);
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-green-800">Correo Enviado</CardTitle>
                <CardDescription className="text-green-700">
                  Te hemos enviado un enlace para restablecer tu contraseña
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-green-300 bg-green-50">
                  <Mail className="h-4 w-4" />
                  <AlertDescription className="text-green-800">
                    Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
                    Si no ves el correo, revisa tu carpeta de spam.
                  </AlertDescription>
                </Alert>
                
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => {
                      setIsEmailSent(false);
                      setEmail("");
                    }}
                    variant="outline"
                    className="w-full border-green-300 text-green-700 hover:bg-green-50"
                  >
                    Intentar con otro correo
                  </Button>
                  
                  <Link to="/login" className="w-full">
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Volver al inicio de sesión
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Recuperar Contraseña</h2>
            <p className="mt-2 text-gray-600">
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
            </p>
          </div>

          <Card className="border-red-100">
            <CardHeader>
              <CardTitle className="text-center text-red-700">Restablecer Contraseña</CardTitle>
              <CardDescription className="text-center">
                Te enviaremos las instrucciones por correo electrónico
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-red-200 focus:ring-red-500 focus:border-red-500"
                    placeholder="tu-email@urbanizacion.com"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Enviando correo...
                    </div>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar enlace de recuperación
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center text-sm text-red-600 hover:text-red-500 hover:underline"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Volver al inicio de sesión
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
