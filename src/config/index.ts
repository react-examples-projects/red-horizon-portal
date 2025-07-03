import { redirectRoute, privateRoute, route } from "@/lib/utils";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import ForgotPassword from "@/pages/ForgotPassword";
import Publications from "@/pages/Publications";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminHome from "@/pages/AdminHome";
import CreatePublication from "@/pages/CreatePublication";
import EditPublication from "@/pages/EditPublication";
import ViewPublication from "@/pages/ViewPublication";
import PublicPost from "@/pages/PublicPost";
import PublicPublications from "@/pages/PublicPublications";
import NotFound from "@/pages/NotFound";

const routes = [
  privateRoute(Publications, "/publicaciones"),
  privateRoute(AdminDashboard, "/admin"),
  privateRoute(AdminHome, "/admin/home"),
  privateRoute(CreatePublication, "/admin/crear-publicacion"),
  privateRoute(EditPublication, "/admin/editar-publicacion/:id"),
  privateRoute(ViewPublication, "/admin/publicacion/:id"),
  route(PublicPost, "/post/:id", { public: true }),
  route(PublicPublications, "/publicaciones-publicas", { public: true }),
  redirectRoute(Login, "/login"),
  route(Index, "/", { public: true }),
  route(ForgotPassword, "/forgot-password", { public: true }),
  route(NotFound, "*", { public: true }),
];

export default routes;
