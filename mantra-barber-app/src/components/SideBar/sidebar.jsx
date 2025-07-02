import {
  HiChartPie,
  HiUser,
  HiCalendar,
  HiViewBoards,
  HiOutlineLogout,
  HiOutlineDocument,
  HiMenuAlt1,
  HiX,
  HiClipboardList,
} from "react-icons/hi";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import {
  Navbar,
  Dropdown,
  DropdownHeader,
  DropdownItem,
} from "flowbite-react";
import mantraLogo from "../../assets/mantraLogo.PNG";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUser } from "../../redux/slices/auth";
import { toast } from "react-toastify";

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard", icon: <HiChartPie /> },
  { to: "/admin/bookings", label: "Bookings", icon: <HiCalendar /> },
  { to: "/admin/barbers", label: "Barbers", icon: <HiUser /> },
  { to: "/admin/services", label: "Services", icon: <HiViewBoards /> },
  { to: "/admin/products", label: "Products", icon: <HiOutlineDocument /> },
  { to: "/admin/reports", label: "Reports", icon: <HiClipboardList /> },
];

const SideBar = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleLogout = useCallback(() => {
    dispatch(setUser(null));
    dispatch(setToken(null));
    toast.success("Logout berhasil");
    navigate({ to: "/login" }, { replace: true });
  }, [dispatch, navigate]);

  const shouldShowFullSidebar = isSidebarOpen || isHovering;

  // Proteksi untuk non-admin
  useEffect(() => {
    if (user?.role !== "admin") {
      navigate({ to: "/" });
    }
  }, [user, navigate]);

  return (
    <div className="flex h-screen bg-white text-black">
      {/* Sidebar */}
      <aside
        onMouseEnter={() => !isSidebarOpen && setIsHovering(true)}
        onMouseLeave={() => !isSidebarOpen && setIsHovering(false)}
        className={`transition-all duration-300 ease-in-out fixed z-40 h-full bg-white border-r border-gray-200 overflow-hidden ${
          shouldShowFullSidebar ? (isMobile ? "w-1/2" : "w-64") : "w-16"
        }`}
      >
        <div className={`flex items-center py-4 border-b !border-gray-200 px-4`}>
          <img src={mantraLogo} alt="Logo" className="h-8 mr-2" />
          {shouldShowFullSidebar && <span className="text-xl font-bold">MANTRA</span>}
        </div>

        <nav className="px-2 py-6">
          <ul className="space-y-2">
            {adminLinks.map(({ to, icon, label }) => (
              <SidebarLink
                key={to}
                to={to}
                icon={icon}
                label={label}
                open={shouldShowFullSidebar}
                isMobile={isMobile}
                onClickMobile={() => setIsSidebarOpen(false)}
              />
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div
        className={`flex flex-col transition-all duration-300 ease-in-out flex-1 min-w-0 ${
          shouldShowFullSidebar ? (isMobile ? "ml-[50%]" : "ml-64") : "ml-16"
        }`}
      >
        {/* Topbar */}
        <Navbar className="border-b !border-gray-200 !bg-white px-6 py-3">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              <button onClick={toggleSidebar} className="text-gray-600">
                {isSidebarOpen ? <HiX size={24} /> : <HiMenuAlt1 size={24} />}
              </button>
              <h1 className="text-lg font-semibold">Dashboard Admin</h1>
            </div>

            <Dropdown
              arrowIcon={false}
              inline
              label={
                <div className="flex items-center space-x-3 cursor-pointer">
                  <span className="text-md font-medium text-gray-900">{user?.name}</span>
                  <img
                    src={
                      !user?.profile_picture || user.profile_picture === "null"
                        ? "https://i.pinimg.com/736x/25/a3/3f/25a33f3b84b18d51305822ee72dfcbff.jpg"
                        : user.profile_picture
                    }
                    alt="User"
                    className="w-10 h-10 object-cover rounded-full border border-gray-400"
                  />
                </div>
              }
            >
              <DropdownHeader>
                <span className="block text-sm">{user?.name}</span>
                <span className="block truncate text-sm font-medium">
                  {user?.email}
                </span>
              </DropdownHeader>
              <DropdownItem icon={HiOutlineClipboardDocumentList} as={Link} to="/my-bookings">
                My Bookings
              </DropdownItem>
              <DropdownItem icon={HiOutlineLogout} onClick={handleLogout}>
                Logout
              </DropdownItem>
            </Dropdown>
          </div>
        </Navbar>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">{children}</main>
      </div>
    </div>
  );
};

const SidebarLink = ({ to, icon, label, open, onClickMobile, isMobile }) => {
  const pathname = useLocation().pathname;
  const isActive = pathname.startsWith(to);

  return (
    <li>
      <Link
        to={to}
        onClick={() => isMobile && onClickMobile()}
        className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 transition duration-200 ${
          isActive ? "bg-gray-200 font-semibold" : "text-black"
        }`}
      >
        <span className="text-lg mr-3">{icon}</span>
        {open && <span>{label}</span>}
      </Link>
    </li>
  );
};

export default SideBar;
