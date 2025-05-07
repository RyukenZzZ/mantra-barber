import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import NavigationBar from '../components/Navbar/navbar';

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const hideNavbarOn = ['/login', '/register'];

  return (
    <>
      {!hideNavbarOn.includes(pathname) && <NavigationBar />}
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
