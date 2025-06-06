import {
  createRootRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { ToastContainer } from "react-toastify";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import NavigationBar from "../components/Navbar/navbar";
import SideBar from "../components/SideBar/sidebar"; // asumsi file sidebar kamu
import { GoogleOAuthProvider } from "@react-oauth/google";

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const hideNavbarOn = ["/login", "/register"];
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <>
        {/* Tampilkan Sidebar jika /admin, selain itu NavigationBar jika tidak di-hide */}
        {isAdminRoute ? (
          <SideBar>
            <Outlet />
          </SideBar>
        ) : (
          <>
            {!hideNavbarOn.includes(pathname) && <NavigationBar />}
            <Outlet />
          </>
        )}

        <TanStackRouterDevtools />
        <ToastContainer theme="colored" />
      </>
    </GoogleOAuthProvider>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
