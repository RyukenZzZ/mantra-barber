import {
  HiChartPie,
  HiUser,
  HiCalendar,
  HiViewBoards,
  HiOutlineLogout,
  HiOutlineDocument,
  HiMenuAlt1,
  HiClipboardList,
} from "react-icons/hi";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Navbar,
  Dropdown,
  DropdownHeader,
  DropdownItem,
} from "flowbite-react";
import mantraLogo from "../../assets/mantraLogo.png";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUser } from "../../redux/slices/auth";
import { toast } from "react-toastify";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";

const SideBar = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleResize = () => {
    const mobile = window.innerWidth < 1024;
    setIsMobile(mobile);
    setIsSidebarOpen(!mobile); // true untuk desktop, false untuk mobile
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleLogout = useCallback(() => {
    dispatch(setUser(null));
    dispatch(setToken(null));
    toast.success("Logout berhasil");
    navigate({ to: "/login" });
    window.location.reload(); // untuk mencegah hydration pakai localStorage lama
  }, [dispatch, navigate]);


  const shouldShowFullSidebar = isSidebarOpen || isHovering;

  return (
    <div className="flex h-screen text-black bg-white">
      {/* Sidebar */}
      <aside
        onMouseEnter={() => {
          if (!isSidebarOpen) setIsHovering(true);
        }}
        onMouseLeave={() => {
          if (!isSidebarOpen) setIsHovering(false);
        }}
        className={`
          transition-all duration-300
          bg-white border-r border-gray-200 overflow-hidden fixed z-40 h-full
          ${shouldShowFullSidebar ? (isMobile ? "w-1/2" : "w-64") : "w-16"}
        `}
      >
        <div
          className={`flex items-center border-b border-gray-200 py-4 transition-all duration-300
            ${shouldShowFullSidebar ? "px-4 justify-start" : "justify-center px-1"}
          `}
        >
          <img
            src={mantraLogo}
            alt="Logo"
            className={`h-8 transition-all duration-300 ${
              shouldShowFullSidebar ? "mr-2" : ""
            }`}
          />
          {shouldShowFullSidebar && (
            <span className="text-xl font-bold">MANTRA</span>
          )}
        </div>

        <nav className="px-2 py-6">
          <ul className="space-y-2">
            <SidebarLink
              to="/admin/dashboard"
              icon={<HiChartPie />}
              label="Dashboard"
              open={shouldShowFullSidebar}
              onClickMobile={() => setIsSidebarOpen(false)}
              isMobile={isMobile}
            />
            <SidebarLink
              to="/admin/bookings"
              icon={<HiCalendar />}
              label="Bookings"
              open={shouldShowFullSidebar}
              onClickMobile={() => setIsSidebarOpen(false)}
              isMobile={isMobile}
            />
            <SidebarLink
              to="/admin/barbers"
              icon={<HiUser />}
              label="Barbers"
              open={shouldShowFullSidebar}
              onClickMobile={() => setIsSidebarOpen(false)}
              isMobile={isMobile}
            />
            <SidebarLink
              to="/admin/services"
              icon={<HiViewBoards />}
              label="Services"
              open={shouldShowFullSidebar}
              onClickMobile={() => setIsSidebarOpen(false)}
              isMobile={isMobile}
            />
            <SidebarLink
              to="/admin/products"
              icon={<HiOutlineDocument />}
              label="Products"
              open={shouldShowFullSidebar}
              onClickMobile={() => setIsSidebarOpen(false)}
              isMobile={isMobile}
            />
            <SidebarLink
              to="/admin/reports"
              icon={<HiClipboardList />}
              label="Reports"
              open={shouldShowFullSidebar}
              onClickMobile={() => setIsSidebarOpen(false)}
              isMobile={isMobile}
            />
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
<div
  className={`flex flex-col transition-all duration-300 ${
    shouldShowFullSidebar ? (isMobile ? "ml-[50%]" : "ml-64") : "ml-16"
  } flex-1 min-w-0`}
>

        {/* Top Navbar */}
        <Navbar className="border-b !border-gray-200 !bg-white px-6 py-3">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              <button onClick={toggleSidebar} className="text-gray-600">
                <HiMenuAlt1 size={24} />
              </button>
              <h1 className="text-lg font-semibold">Dashboard Admin</h1>
            </div>

            <Dropdown
              arrowIcon={false}
              inline
              label={
                <div className="flex items-center space-x-3 cursor-pointer">
                  <span className="text-md font-medium text-gray-900">
                    {user.name}
                  </span>
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
                    className="w-10 h-10 object-cover rounded-full border border-gray-400"
                  />
                </div>
              }
            >
              <DropdownHeader>
                <span className="block text-sm">{user.name}</span>
                <span className="block truncate text-sm font-medium">
                  {user.email}
                </span>
              </DropdownHeader>
              <DropdownItem icon={HiOutlineLogout} onClick={handleLogout}>
                Logout
              </DropdownItem>
              <DropdownItem icon={HiOutlineClipboardDocumentList} as={Link} to="/my-bookings">
                My-bookings
              </DropdownItem>
            </Dropdown>
          </div>
        </Navbar>

        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

// Reusable sidebar link
const SidebarLink = ({ to, icon, label, open, onClickMobile, isMobile }) => {
  return (
    <li>
      <Link
        to={to}
        onClick={() => {
          if (isMobile) onClickMobile();
        }}
        className="flex items-center px-4 py-2 text-sm font-medium text-black rounded-lg hover:bg-gray-100"
      >
        <span className="text-lg mr-3">{icon}</span>
        {open && <span>{label}</span>}
      </Link>
    </li>
  );
};

export default SideBar;
