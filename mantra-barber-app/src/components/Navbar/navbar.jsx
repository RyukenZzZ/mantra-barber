import {
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
} from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { setToken, setUser } from "../../redux/slices/auth";
import mantraLogo from "../../assets/mantraLogo.PNG";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { profile } from "../../service/auth";
import { toast } from "react-toastify";
import { flushSync } from "react-dom";

const NavigationBar = () => {
  const [activeSection, setActiveSection] = useState("");
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, token } = useSelector((state) => state.auth);

  const handleLogout = useCallback(() => {
  flushSync(() => {
    dispatch(setUser(null));
    dispatch(setToken(null));
  });
    toast.success("Logout berhasil");
    navigate({ to: "/login", replace: true });
  }, [dispatch, navigate]);

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: profile,
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (isSuccess) {
      dispatch(setUser(data));
    } else if (isError) {
      toast.error(
        "Sesi berakhir atau gagal memuat profil. Silakan login kembali."
      );
      handleLogout(); // logout dan redirect
    }
  }, [isSuccess, isError, data, dispatch, handleLogout]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsNavbarVisible(currentScrollY < lastScrollY || currentScrollY < 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleHashChange = () => {
      setActiveSection(window.location.hash);
    };
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const logout = () => {
    handleLogout();
  };

  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const getLinkClass = (to, hash) => {
    if (hash) {
      return `text-lg ${
        activeSection === hash ? "text-black font-semibold" : "text-gray-500"
      } hover:text-gray-700`;
    }

    // Untuk halaman non-hash seperti /history-bookings
    const isActive = location.pathname === to;
    return `text-lg ${isActive ? "text-black font-semibold" : "text-gray-500"} hover:text-gray-700`;
  };

  if (isLoading) return null;

  return (
    <Navbar
      fluid
      rounded
      className={`!bg-gray-100 transition-transform duration-300 ${
        isNavbarVisible ? "translate-y-0" : "-translate-y-full"
      } fixed w-full z-50 top-0`}
    >
      <NavbarBrand as={Link} href="/">
        <img src={mantraLogo} className="mr-3 h-12 w-full" alt="Mantra Logo" />
      </NavbarBrand>

      {user ? (
        <div className="flex md:order-2 items-center">
          <p className="text-md me-2 font-semibold text-black">{user.name}</p>
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <img
                src={
                  !user.profile_picture ||
                  user.profile_picture === "null" ||
                  user.profile_picture === null
                    ? "https://i.pinimg.com/736x/25/a3/3f/25a33f3b84b18d51305822ee72dfcbff.jpg"
                    : user.profile_picture
                }
                alt="User avatar"
                referrerPolicy="no-referrer"
                className="w-10 h-10 border-1 border-black object-cover rounded-full"
              />
            }
          >
            <DropdownHeader>
              <span className="block text-sm">{user.name}</span>
              <span className="block truncate text-sm font-medium">
                {user.email}
              </span>
            </DropdownHeader>
            <DropdownItem as={Link} to="/profile">
              Profile
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem onClick={logout}>Sign out</DropdownItem>
          </Dropdown>
          <NavbarToggle />
        </div>
      ) : (
        <>
          <div className="hidden md:flex gap-2 md:order-2">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
            >
              Sign Up
            </Link>
          </div>
          <NavbarToggle />
        </>
      )}

      <NavbarCollapse>
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 w-full md:justify-end">
          {[
            { to: "/", label: "Home", hash: "home" },
            { to: "/", label: "About", hash: "about" },
            { to: "/", label: "Services", hash: "services" },
            { to: "/", label: "Product", hash: "product" },
            { to: "/", label: "Gallery", hash: "gallery" },
            { to: "/history-bookings", label: "Check Booking" }, // tanpa hash
          ].map(({ to, label, hash }) => (
            <Link
              key={`${to}${hash || ""}`}
              to={to}
              {...(hash ? { hash } : {})}
              className={getLinkClass(to, hash)}
            >
              {label}
            </Link>
          ))}

          {!user && (
            <div className="flex flex-col md:hidden gap-2 mt-4 items-center">
              <Link
                to="/login"
                className="w-40 text-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="w-40 text-center px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </NavbarCollapse>
    </Navbar>
  );
};

export default NavigationBar;
