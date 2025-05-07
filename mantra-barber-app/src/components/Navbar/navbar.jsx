
import { Link, useRouter } from "@tanstack/react-router";
import {
    Avatar,
    Dropdown,
    DropdownDivider,
    DropdownHeader,
    DropdownItem,
    Navbar,
    NavbarBrand,
    NavbarCollapse,
    NavbarLink,
    NavbarToggle,
  } from "flowbite-react";
  
  const NavigationBar = () => {
    const { state } = useRouter();
    const currentPath = state.location.pathname;

    return (
      <Navbar fluid rounded>
        <NavbarBrand as={Link} href="/">
          <img src="https://flowbite.com/docs/images/logo.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Mantra Barber</span>
        </NavbarBrand>
        <div className="flex md:order-2">
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />
            }
          >
            <DropdownHeader>
              <span className="block text-sm">Bonnie Green</span>
              <span className="block truncate text-sm font-medium">name@flowbite.com</span>
            </DropdownHeader>
            <DropdownItem>Dashboard</DropdownItem>
            <DropdownItem>Settings</DropdownItem>
            <DropdownItem>Earnings</DropdownItem>
            <DropdownDivider />
            <DropdownItem>Sign out</DropdownItem>
          </Dropdown>
          <NavbarToggle />
        </div>
        <NavbarCollapse>
        <NavbarLink as={Link} to="/" active={currentPath === "/"}>
          Home
        </NavbarLink>
        <NavbarLink as={Link} to="/about" active={currentPath === "/about"}>
          About
        </NavbarLink>
        <NavbarLink as={Link} to="/services" active={currentPath === "/services"}>
          Services
        </NavbarLink>
        <NavbarLink as={Link} to="/pricing" active={currentPath === "/pricing"}>
          Pricing
        </NavbarLink>
        <NavbarLink as={Link} to="/contact" active={currentPath === "/contact"}>
          Contact
        </NavbarLink>
      </NavbarCollapse>
      </Navbar>
    );
  }
  
  export default NavigationBar;