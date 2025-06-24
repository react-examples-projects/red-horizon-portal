import { redirectRoute, privateRoute, route } from "@/lib/utils";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import ForgotPassword from "@/pages/ForgotPassword";
import Publications from "@/pages/Publications";
import AdminDashboard from "@/pages/AdminDashboard";
import CreatePublication from "@/pages/CreatePublication";
import EditPublication from "@/pages/EditPublication";
import NotFound from "@/pages/NotFound";

const routes = [
  route(Index, "/", { public: true }),
  route(Login, "/login", { public: true }),
  route(ForgotPassword, "/forgot-password", { public: true }),
  route(Publications, "/publicaciones", { public: true }),
  privateRoute(AdminDashboard, "/admin", { private: true }),
  privateRoute(CreatePublication, "/admin/crear-publicacion", { private: true }),
  privateRoute(EditPublication, "/admin/editar-publicacion/:id", { private: true }),
  redirectRoute(NotFound, "*", { redirect: true }),
];

export default routes;
