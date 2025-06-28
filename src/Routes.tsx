import PrivateRoute from "@/components/routes/PrivateRoute";
import RedirectRoute from "@/components/routes/RedirectRoute";
import routers from "@/config";
import PublicRoute from "@/components/routes/PublicRoute";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";

export default function Routers() {
  return (
    <BrowserRouter>
      <Routes>
        {routers.map(
          (
            {
              path,
              element: Element,
              private: isPrivate,
              redirect: isRedirect,

              ...props
            },
            i
          ) => {
            const key = path || i;
            const AuthRoute = isPrivate ? PrivateRoute : isRedirect ? RedirectRoute : null;

            const Wrapper = () =>
              AuthRoute === null ? (
                <PublicRoute>
                  <Element />
                </PublicRoute>
              ) : (
                <AuthRoute>
                  <Element />
                </AuthRoute>
              );

            return <Route element={<Wrapper />} path={path} key={key} {...props} />;
          }
        )}
      </Routes>
    </BrowserRouter>
  );
}
