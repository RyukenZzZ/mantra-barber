import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
} from "flowbite-react";
import { useEffect, useState } from "react";
import mantraLogo from "../../assets/mantraLogo.png";
import { Link } from "@tanstack/react-router";

const NavigationBar = () => {
  const [activeSection, setActiveSection] = useState("");
const [isNavbarVisible, setIsNavbarVisible] = useState(true);
const [lastScrollY, setLastScrollY] = useState(0);

useEffect(() => {
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      setIsNavbarVisible(false); // Scroll down: hide navbar
    } else {
      setIsNavbarVisible(true); // Scroll up: show navbar
    }
    setLastScrollY(currentScrollY);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [lastScrollY]);

  // Simulasi login
  const user = null;
  // const user = {
  //   name: "Bonnie Green",
  //   email: "name@flowbite.com",
  //   avatar: "https://flowbite.com/docs/images/people/profile-picture-5.jpg",
  // };

  useEffect(() => {
    const handleHashChange = () => {
      setActiveSection(window.location.hash);
    };
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const getLinkClass = (hash) =>
    `text-lg ${
      activeSection === hash ? "text-black font-semibold" : "text-gray-500"
    } hover:text-gray-700`;

  return (
<Navbar
  fluid
  rounded
  className={`!bg-gray-100 transition-transform duration-300 ${
    isNavbarVisible ? "translate-y-0" : "-translate-y-full"
  } fixed w-full z-50 top-0`}
>
      <NavbarBrand href="#home">
        <img
          src={mantraLogo}
          className="mr-3 h-6 w-full sm:h-9"
          alt="Mantra Logo"
        />
      </NavbarBrand>

      {user ? (
        <div className="flex md:order-2 items-center">
          <p className="text-md me-2 font-semibold text-black">{user.name}</p>
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                img={
                  user.avatar ||
                  "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                }
                rounded
              />
            }
          >
            <DropdownHeader>
              <span className="block text-sm">{user.name}</span>
              <span className="block truncate text-sm font-medium">
                {user.email}
              </span>
            </DropdownHeader>
            <DropdownItem>Dashboard</DropdownItem>
            <DropdownItem>Settings</DropdownItem>
            <DropdownItem>Earnings</DropdownItem>
            <DropdownDivider />
            <DropdownItem>Sign out</DropdownItem>
          </Dropdown>
          <NavbarToggle />
        </div>
      ) : (
        <>
          {/* Desktop View */}
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
          {/* Hamburger button */}
          <NavbarToggle />
        </>
      )}

<NavbarCollapse>
  <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 w-full md:justify-end">
    <a
      href="#home"
      className={`${getLinkClass("#home")} hover:font-semibold transition duration-200`}
    >
      Home
    </a>
    <a
      href="#about"
      className={`${getLinkClass("#about")} hover:font-semibold transition duration-200`}
    >
      About
    </a>
    <a
      href="#services"
      className={`${getLinkClass("#services")} hover:font-semibold transition duration-200`}
    >
      Services
    </a>
    <a
      href="#product"
      className={`${getLinkClass("#product")} hover:font-semibold transition duration-200`}
    >
      Product
    </a>
    <a
      href="#gallery"
      className={`${getLinkClass("#gallery")} hover:font-semibold transition duration-200`}
    >
      Gallery
    </a>

    {/* Mobile View: Sign In & Sign Up */}
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
