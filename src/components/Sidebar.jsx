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

const FILE = (
  <>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
  </>
);

const ICONS = {
  home: (
    <Icon>
      <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
    </Icon>
  ),
  staffAttendance: (
    <Icon>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M16 11l2 2 4-4" />
    </Icon>
  ),
  studentAttendance: (
    <Icon>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4" />
    </Icon>
  ),
  receipts: (
    <Icon>
      {FILE}
      <path d="M8 13h8M8 17h8" />
    </Icon>
  ),
  generateReceipts: (
    <Icon>
      {FILE}
      <path d="M12 18v-6M9 15h6" />
    </Icon>
  ),
  allReceipts: (
    <Icon>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </Icon>
  ),
  students: (
    <Icon>
      <path d="M22 10L12 5 2 10l10 5 10-5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </Icon>
  ),
  staffs: (
    <Icon>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </Icon>
  ),
};

const Sidebar = ({
  variant = "fixed",
  onClose,
  collapsed = false,
  onToggleCollapse,
}) => {
  const isDrawer = variant === "drawer";

  const widthClass = isDrawer ? "w-64 max-w-[85vw]" : "h-full w-full";
  const labelClass = !isDrawer && collapsed ? "sr-only" : "";
  const rowClass = !isDrawer && collapsed ? "justify-center" : "justify-start";

  const itemBase =
    "flex w-full cursor-pointer items-center gap-3 rounded-lg px-3.5 py-2.5 text-left text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300";

  return (
    <aside
      className={`flex h-dvh shrink-0 flex-col overflow-hidden bg-[#06066f] text-white ${widthClass}`}
    >
      <div
        className={`flex min-h-22 items-center gap-3 border-b border-white/15 px-3 py-4 ${
          !isDrawer && collapsed ? "justify-center" : "justify-start px-5"
        }`}
      >
        <span
          className="relative h-10 w-10 shrink-0 overflow-hidden"
          aria-hidden="true"
        >
          <img
            src="/logo-white.png"
            alt=""
            className="absolute left-1/2 top-1/2 w-19 max-w-none -translate-x-1/2 -translate-y-1/2"
          />
        </span>
        <span className={`min-w-0 flex-1 leading-tight ${labelClass}`}>
          <span className="block text-sm font-bold uppercase">Zyetech</span>
          <span className="mt-1 block text-[0.62rem] font-medium uppercase tracking-[0.12em] text-white/70">
            Innovation Technology
          </span>
        </span>
        {isDrawer && onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="ml-auto cursor-pointer rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-indigo-300"
          >
            <Icon>
              <path d="M18 6L6 18M6 6l12 12" />
            </Icon>
          </button>
        )}
      </div>

      <nav aria-label="Admin" className="flex flex-col gap-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          return (
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
                    ? "bg-white text-[#06066f]"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {ICONS[item.icon]}
              <span className={labelClass}>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/15 px-3 py-4">
        <div
          className={`${itemBase} ${rowClass} text-white/60`}
          aria-label="Administrator"
          title="Administrator"
        >
          <Icon>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </Icon>
          <span className={labelClass}>Admin</span>
        </div>
        {!isDrawer && onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`${itemBase} mt-2 ${rowClass} text-white/80 hover:bg-white/10 hover:text-white`}
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
