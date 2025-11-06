"use client";

import type React from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  CalendarDays,
  School,
  Users,
  FileText,
  BarChart3,
  LogOut,
  User,
  BookOpen,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  UserCircle,
  Settings,
  ChevronDown,
  Barcode,
  ChevronUp,
} from "lucide-react";
import ThemeToggle from "../UI/theme-toggle";
import { useRouter } from "next/navigation";

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const handleLogout = async () => {
    const res = await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      router.push("/");
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [schoolMenuOpen, setSchoolMenuOpen] = useState(false);
  const [absensiMenuOpen, setAbsensiMenuOpen] = useState(false);
  const pathname = usePathname();

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const sidebarWidthClass = isSidebarOpen
    ? "w-[min(16rem,100vw)] md:w-64"
    : "w-[min(5rem,100vw)] md:w-20";
  const contentMarginClass = isSidebarOpen ? "md:ml-64" : "md:ml-20";

  const handleLinkClick = () => {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const NavLink = ({
    href,
    label,
    icon: Icon,
  }: {
    href: string;
    label: string;
    icon: React.ElementType;
  }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        onClick={handleLinkClick}
        className={`flex items-center ${isSidebarOpen ? "px-4" : "justify-center"
          } py-3 mx-2 rounded-lg
        transition duration-200
        ${isActive
            ? "text-cyan-500 bg-gray-200 dark:bg-gray-800 shadow-lg"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-cyan-500"
          }
        group relative`}
      >
        <Icon className={`w-5 h-5 ${isSidebarOpen ? "mr-3" : "mx-0"}`} />
        {isSidebarOpen && <span className="text-sm font-medium">{label}</span>}
      </Link>
    );
  };

  const menuItems = [
    {
      title: "Navigasi Utama",
      items: [{ href: "/admin/dashboard", label: "Dashboard", icon: Home }],
    },
    {
      dropdown: true,
      label: "Manajemen Pengguna",
      icon: Users,
      state: userMenuOpen,
      toggle: () => setUserMenuOpen(!userMenuOpen),
      children: [
        { href: "/admin/akun/guru", label: "Guru", icon: User },
        { href: "/admin/akun/sekertaris", label: "Sekertaris", icon: User },
        { href: "/admin/akun/view", label: "View", icon: User },
      ],
    },
    {
      dropdown: true,
      label: "Manajemen Sekolah",
      icon: School,
      state: schoolMenuOpen,
      toggle: () => setSchoolMenuOpen(!schoolMenuOpen),
      children: [
        { href: "/admin/tahun-ajaran", label: "Tahun Ajaran", icon: BookOpen },
        { href: "/admin/jurusan", label: "Jurusan", icon: User },
        { href: "/admin/kelas", label: "Kelas", icon: BookOpen },
        { href: "/admin/mapel", label: "Mata Pelajaran", icon: FileText },
        { href: "/admin/siswa", label: "Siswa", icon: Users },
      ],
    },
  {
      dropdown: true,
      label: "Manajemen Absensi",
      icon: BarChart3,
      state: absensiMenuOpen,
      toggle: () => setAbsensiMenuOpen(!absensiMenuOpen),
      children: [
        { href: "/admin/absensi", label: "Absensi", icon: ClipboardList },
        { href: "/admin/rekap-absensi", label: "Rekap Absensi", icon: FileText },
        { href: "/admin/agenda-kelas", label: "Agenda Kelas", icon: FileText },
        { href: "/admin/rekap-agenda-kelas", label: "Rekap Agenda Kelas", icon: FileText },
        // ✅ Menu baru: "Absen Scan" — diperbagus & konsisten
        { href: "/admin/absenscan", label: "Absen Scan", icon: Barcode },
      ],
    },
    {
      items: [
        { href: "/admin/calendar", label: "Kalender", icon: CalendarDays },
        { href: "/admin/agenda", label: "Agenda Umum", icon: ClipboardList },
      ],
    },
  ];

  const getPageTitle = (pathname: string): string => {
    if (pathname.includes("/admin/dashboard")) return "Dashboard";
    if (pathname.includes("/admin/akun/guru")) return "Manage Guru";
    if (pathname.includes("/admin/akun/sekertaris")) return "Manage Sekertaris";
    if (pathname.includes("/admin/akun/view")) return "Manage View-Only";
    if (pathname.includes("/admin/tahun-ajaran")) return "Tahun Ajaran";
    if (pathname.includes("/admin/jurusan")) return "Manage Jurusan";
    if (pathname.includes("/admin/kelas")) return "Manage Kelas";
    if (pathname.includes("/admin/mapel")) return "Manage Mata Pelajaran";
    if (pathname.includes("/admin/siswa")) return "Manage Siswa";
    if (pathname.includes("/admin/absensi")) return "Absensi";
        if (pathname.includes("/admin/absenscan")) return "Absensi Scan";
    if (pathname.includes("/admin/rekap-absensi")) return "Rekap Absensi";
    if (pathname.includes("/admin/agenda-kelas")) return "Agenda Kelas";
    if (pathname.includes("/admin/rekap-agenda-kelas")) return "Rekap Agenda Kelas";
    if (pathname.includes("/admin/calendar")) return "Kalender";
    if (pathname.includes("/admin/agenda")) return "Agenda Umum";
    return "Halaman";
  };

  const pageTitle = getPageTitle(pathname);

  const UserDropdown = () => {
    return (
      <div
        className={`relative w-full ${isSidebarOpen ? "px-4" : "px-2"
          } flex items-center justify-between py-3 cursor-pointer border-t border-gray-200 dark:border-gray-700`}
        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
            <UserCircle className="w-5 h-5 text-white" />
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col">
              <span className="text-sm font-medium">Admin</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Akun Dengan Semua Akses</span>
            </div>
          )}
        </div>

        {isSidebarOpen && (
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${isUserDropdownOpen ? "rotate-180" : ""
              }`}
          />
        )}

        {/* Dropdown Menu */}
        {isUserDropdownOpen && (
          <div
            className={`absolute bottom-full left-0 right-0 mb-2 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg z-50 border border-gray-200 dark:border-gray-700 transition-all duration-200 ease-out ${
              isSidebarOpen ? 'w-full' : 'w-[calc(100%+1rem)] left-[-0.5rem]'
            }`}
            onClick={(e) => e.stopPropagation()}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu-button"
          >
            <div className="space-y-1">
              <button
                type="button"
                className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                onClick={() => {
                  setIsUserDropdownOpen(false);
                  handleLogout();
                }}
                role="menuitem"
              >
                <LogOut className="w-4 h-4 mr-2 flex-shrink-0" aria-hidden="true" />
                Logout
              </button>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-center text-xs text-gray-500 dark:text-gray-400 select-none">
                © 2025 RPL SMKN Katapang
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen ${sidebarWidthClass} bg-white dark:bg-gray-900 text-gray-800 dark:text-white border-r border-gray-200 dark:border-gray-700
          transition-all duration-300 flex flex-col
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo - shrink-0 agar tidak scroll */}
        <div
          className={`h-16 flex items-center ${isSidebarOpen ? "px-6" : "justify-center"
            } border-b border-gray-200 dark:border-gray-700 shrink-0`}
        >
          <Link href="/admin/dashboard" className="flex items-center space-x-2">
            <div className="w-12 h-12 flex items-center justify-center">
              <img
                src="/images/Logo/Sekolah.png"
                alt="Logo Sekolah"
                className="w-10 h-10 object-contain"
              />
            </div>
            {isSidebarOpen && <span className="text-xl font-bold">Admin Panel</span>}
          </Link>
        </div>

        {/* NAVIGATION - SCROLLABLE AREA */}
        <nav className="flex-1 overflow-y-auto py-4 min-h-0">
          <div className="space-y-1 px-2">
            {menuItems.map((menu, index) => (
              <div key={index}>
                {menu.title && isSidebarOpen && (
                  <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                    {menu.title}
                  </h3>
                )}

                {menu.items &&
                  menu.items.map((item, i) => (
                    <NavLink key={i} href={item.href} label={item.label} icon={item.icon} />
                  ))}

                {menu.dropdown && (
                  <>
                    <button
                      onClick={menu.toggle}
                      className={`w-full flex items-center ${isSidebarOpen ? "px-4" : "justify-center"
                        } py-3 mx-2 rounded-lg text-left
                      transition duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-cyan-500`}
                    >
                      <menu.icon className="w-5 h-5 mr-3" />
                      {isSidebarOpen && (
                        <>
                          <span className="text-sm font-medium flex-1">{menu.label}</span>
                          {menu.state ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </>
                      )}
                    </button>
                    {menu.state && (
                      <div className="ml-10 mt-1 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        {menu.children.map((child, ci) => (
                          <NavLink key={ci} href={child.href} label={child.label} icon={child.icon} />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* USER DROPDOWN - SELALU DI BAWAH */}
        <div className="shrink-0">
          {isSidebarOpen && (
            <div className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1 mt-2">
              Akun
            </div>
          )}
          <UserDropdown />
        </div>
      </aside>

      {/* BACKDROP - hanya di mobile */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
        />
      )}

      {/* CONTENT */}
      <div
        className={`flex-1 transition-all duration-300 ${contentMarginClass} overflow-x-hidden`}
      >
        {isSidebarOpen ? (
          <header
            className="
              fixed
              w-screen md:w-[calc(100vw-256px)]
              h-16
              bg-white dark:bg-gray-900
              border-b border-gray-200 dark:border-gray-700
              text-gray-900 dark:text-white
              flex items-center justify-between
              px-8 z-30
            "
          >
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 md:hidden rounded"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hidden md:block bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg"
              >
                {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>

              <h1 className="text-lg font-semibold">Admin - {pageTitle}</h1>
            </div>

            <div className="flex items-center space-x-3">
              <ThemeToggle />
            </div>
          </header>
        ) : (
          <header
            className="
              fixed
              w-screen md:w-[calc(100vw-80px)]
              h-16
              bg-white dark:bg-gray-900
              border-b border-gray-200 dark:border-gray-700
              text-gray-900 dark:text-white
              flex items-center justify-between
              px-4 z-30
            "
          >
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 md:hidden rounded"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hidden md:block bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg"
              >
                {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>

              <h1 className="text-lg font-semibold">Admin - {pageTitle}</h1>
            </div>

            <div className="flex items-center space-x-3">
              <ThemeToggle />
            </div>
          </header>
        )}

        <main className="mt-10 p-3 md:p-6 overflow-y-auto min-h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 transition-colors duration-300">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Sidebar;