import {
  createRootRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { ToastContainer } from "react-toastify";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import NavigationBar from "../components/Navbar/navbar";
import { GoogleOAuthProvider } from "@react-oauth/google";

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const hideNavbarOn = ["/login", "/register","/admin/dashboard"];

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <>
        {!hideNavbarOn.includes(pathname) && <NavigationBar />}
        <Outlet />
        <TanStackRouterDevtools />
        <ToastContainer theme="colored" />
      </>
    </GoogleOAuthProvider>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
