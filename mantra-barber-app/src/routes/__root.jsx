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
import { useSelector } from "react-redux";

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, token } = useSelector((state) => state.auth);

  const hideNavbarOn = ["/login", "/register"];
  const isAdmin = token && user?.role === "admin";

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <>
        {/* Admin dengan Sidebar */}
        {isAdmin ? (
          <SideBar>
            <Outlet />
          </SideBar>
        ) : (
          <>
            {/* Tampilkan Navbar jika bukan di halaman login/register */}
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
