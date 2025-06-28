import { redirectRoute, privateRoute, route } from "@/lib/utils";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import ForgotPassword from "@/pages/ForgotPassword";
import Publications from "@/pages/Publications";
import AdminDashboard from "@/pages/AdminDashboard";
import CreatePublication from "@/pages/CreatePublication";
import EditPublication from "@/pages/EditPublication";
import ViewPublication from "@/pages/ViewPublication";
import NotFound from "@/pages/NotFound";

const routes = [
  privateRoute(Publications, "/publicaciones"),
  privateRoute(AdminDashboard, "/admin"),
  privateRoute(CreatePublication, "/admin/crear-publicacion"),
  privateRoute(EditPublication, "/admin/editar-publicacion/:id"),
  privateRoute(ViewPublication, "/admin/publicacion/:id"),
  redirectRoute(Login, "/login"),
  route(Index, "/", { public: true }),
  route(ForgotPassword, "/forgot-password", { public: true }),
  route(NotFound, "*", { public1: true }),
];

export default routes;
