
import PrivateRoute from "@/components/routes/PrivateRoute";
import RedirectRoute from "@/components/routes/RedirectRoute";
import routers from "@/config";
import useSession from "@/hooks/useSession";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";

export default function Routers() {
  const { session } = useSession();

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
              roles = ["fiba", "federation"],
              ...props
            },
            i
          ) => {
            const key = path || i;
            const AuthRoute = isPrivate ? PrivateRoute : isRedirect ? RedirectRoute : null;
            const isAllowedUser = roles.includes(session?.role);

            const Wrapper = () =>
              AuthRoute === null ? (
                <Element />
              ) : (
                <AuthRoute>
                  <Element />
                </AuthRoute>
              );

            return (
              <Route
                element={
                  !isAllowedUser && isPrivate && session ? (
                    <Navigate to="/dashboard" />
                  ) : (
                   
                      <Wrapper />
                    
                  )
                }
                path={path}
                key={key}
                {...props}
              />
            );
          }
        )}
      </Routes>
    </BrowserRouter>
  );
}
