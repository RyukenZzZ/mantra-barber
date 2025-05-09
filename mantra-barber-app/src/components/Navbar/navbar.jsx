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

const NavigationBar = () => {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleHashChange = () => {
      setActiveSection(window.location.hash);
    };

    // Set once when loaded
    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const getLinkClass = (hash) =>
    `text-lg ${
      activeSection === hash ? "text-black font-semibold" : "text-gray-500"
    } hover:text-gray-700`;

  return (
    <Navbar fluid rounded className="!bg-gray-100">
      <NavbarBrand href="#home">
        <img src={mantraLogo} className="mr-3 h-6 sm:h-9" alt="Mantra Logo" />
      </NavbarBrand>

      <div className="flex md:order-2 items-center">
        <p className="text-md me-2 font-semibold text-black">Boonie Green</p>
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
              alt="User settings"
              img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              rounded
            />
          }
        >
          <DropdownHeader>
            <span className="block text-sm">Bonnie Green</span>
            <span className="block truncate text-sm font-medium">
              name@flowbite.com
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

      <NavbarCollapse>
        <a href="#home" className={getLinkClass("#home")}>Home</a>
        <a href="#about" className={getLinkClass("#about")}>About</a>
        <a href="#services" className={getLinkClass("#services")}>Services</a>
        <a href="#pricing" className={getLinkClass("#pricing")}>Pricing</a>
        <a href="#contact" className={getLinkClass("#contact")}>Contact</a>
      </NavbarCollapse>
    </Navbar>
  );
};

export default NavigationBar;
