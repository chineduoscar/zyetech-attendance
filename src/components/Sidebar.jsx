import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../data/data";

const Icon = ({ children }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 shrink-0"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const navIcon = {
  home: (
    <>
      <path d="m3 10 9-7 9 7" />
      <path d="M5 9v12h14V9M9 21v-7h6v7" />
    </>
  ),
  userManagement: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M19 8v6M22 11h-6" />
    </>
  ),
  staffAttendance: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="m16 11 2 2 4-4" />
    </>
  ),
  studentAttendance: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M16 3.5a4 4 0 0 1 0 7.8M20 21v-2a4 4 0 0 0-3-3.87" />
    </>
  ),
  generateReceipts: (
    <>
      <path d="M4 3h16v18l-3-2-3 2-3-2-3 2-4-2z" />
      <path d="M8 8h8M8 12h8M8 16h3" />
    </>
  ),
  allReceipts: (
    <>
      <path d="M4 3h16v18l-3-2-3 2-3-2-3 2-4-2z" />
      <path d="M8 8h8M8 12h8" />
    </>
  ),
  students: (
    <>
      <circle cx="9" cy="8" r="4" />
      <path d="M3 21v-2a6 6 0 0 1 12 0v2M17 8h4M19 6v4" />
    </>
  ),
  staffs: (
    <>
      <rect x="3" y="7" width="18" height="14" rx="2" />
      <path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2" />
    </>
  ),
};

// Hidden for now. Remove an icon from this list to show the link again.
const HIDDEN_ICONS = ["students", "staffs"];
const visibleNavItems = NAV_ITEMS.filter(
  (item) => !HIDDEN_ICONS.includes(item.icon),
);

const Sidebar = ({
  variant = "fixed",
  onClose,
  collapsed = false,
  onToggleCollapse,
  user,
  onLogout,
  loggingOut,
}) => {
  const isDrawer = variant === "drawer";
  const labelClass = !isDrawer && collapsed ? "sr-only" : "";
  const rowClass = !isDrawer && collapsed ? "justify-center" : "justify-start";
  const itemBase =
    "flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-left text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400";

  return (
    <aside
      className={`flex h-dvh shrink-0 flex-col overflow-hidden border-r border-[#cfd3ec] bg-[#eef0fa] text-[#06066f] ${
        isDrawer ? "w-64 max-w-[85vw]" : "h-full w-full"
      }`}
    >
      <div
        className={`flex min-h-22 items-center gap-3 border-b border-[#cfd3ec] px-3 py-4 ${
          !isDrawer && collapsed ? "justify-center" : "justify-start px-5"
        }`}
      >
        <img
          src="/logo.png"
          alt=""
          aria-hidden="true"
          className="h-10 w-10 shrink-0 object-contain"
        />
        <span className={`min-w-0 flex-1 leading-tight ${labelClass}`}>
          <span className="block text-sm font-bold uppercase">Zyetech</span>
          <span className="mt-1 block text-[0.62rem] font-medium uppercase tracking-[0.12em] text-[#4a4d85]">
            Innovation Technology
          </span>
        </span>
        {isDrawer && onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="ml-auto cursor-pointer rounded-lg p-1.5 text-[#4a4d85] hover:bg-[#dfe2f3] hover:text-[#06066f] focus-visible:outline-2 focus-visible:outline-indigo-400"
          >
            <Icon>
              <path d="M18 6L6 18M6 6l12 12" />
            </Icon>
          </button>
        )}
      </div>

      {user && ["admin", "superadmin"].includes(user.role) && (
        <nav aria-label="Admin" className="flex flex-col gap-1 px-3 py-4">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              end
              onClick={onClose}
              aria-label={item.label}
              title={item.label}
              className={({ isActive }) =>
                `${itemBase} ${rowClass} ${
                  isActive
                    ? "bg-[#06066f] text-white"
                    : "text-[#4a4d85] hover:bg-[#dfe2f3] hover:text-[#06066f]"
                }`
              }
            >
              <Icon>{navIcon[item.icon]}</Icon>
              <span className={labelClass}>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      )}

      <div className="mt-auto border-t border-[#cfd3ec] px-3 py-4">
        <div
          className={`${itemBase} ${rowClass} cursor-default text-[#4a4d85]`}
          title={user?.email}
        >
          <Icon>
            <circle cx="12" cy="8" r="4" />
            <path d="M5 21a7 7 0 0 1 14 0" />
          </Icon>
          <span className={`${labelClass} min-w-0 truncate`}>
            {user?.name || "Administrator"}
          </span>
        </div>
        <button
          type="button"
          onClick={onLogout}
          disabled={loggingOut}
          aria-label="Log out"
          title="Log out"
          className={`${itemBase} ${rowClass} mt-1 cursor-pointer text-[#4a4d85] hover:bg-[#dfe2f3] hover:text-[#06066f] disabled:opacity-60`}
        >
          <Icon>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </Icon>
          <span className={labelClass}>
            {loggingOut ? "Logging out…" : "Log out"}
          </span>
        </button>
        {!isDrawer && onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`${itemBase} ${rowClass} mt-2 cursor-pointer text-[#4a4d85] hover:bg-[#dfe2f3] hover:text-[#06066f]`}
          >
            <Icon>
              {collapsed ? (
                <path d="m9 18 6-6-6-6" />
              ) : (
                <path d="m15 18-6-6 6-6" />
              )}
            </Icon>
            <span className={labelClass}>
              {collapsed ? "Expand sidebar" : "Collapse sidebar"}
            </span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
