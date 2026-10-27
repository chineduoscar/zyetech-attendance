import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { NAV_ITEMS } from "../data/data";

const DashboardLayout = () => {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const title =
    NAV_ITEMS.find((item) => item.path === pathname)?.label || "Dashboard";
  const handleLogout = async () => {
    setLogoutError("");
    setLoggingOut(true);
    try {
      await logout();
      navigate("/admin/login", { replace: true });
    } catch (error) {
      setLogoutError(error.message || "Unable to log out. Please try again.");
      setLoggingOut(false);
    }
  };

  // Close the drawer with the Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="flex h-dvh overflow-hidden bg-white text-[#06066f]">
      <div
        className={`hidden shrink-0 transition-[width] duration-200 lg:block ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((value) => !value)}
          user={user}
          onLogout={handleLogout}
          loggingOut={loggingOut}
        />
      </div>

      {/* Phone and tablet drawer */}
      <div
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity duration-200 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <div
        className={`fixed inset-y-0 left-0 z-40 transition-[transform,visibility] duration-200 lg:hidden ${
          open ? "visible translate-x-0" : "invisible -translate-x-full"
        }`}
      >
        <Sidebar
          variant="drawer"
          onClose={() => setOpen(false)}
          user={user}
          onLogout={handleLogout}
          loggingOut={loggingOut}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="cursor-pointer rounded-lg p-2 text-[#06066f] hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-indigo-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="truncate font-bold">{title}</span>
        </div>

        {/* Only the content area scrolls */}
        <main className="flex-1 overflow-y-auto bg-white p-5 sm:p-8">
          {logoutError && (
            <p
              role="alert"
              className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {logoutError}
            </p>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
