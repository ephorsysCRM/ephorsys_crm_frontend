import {
  LayoutDashboard,
  LogOut,
  X,
  Users,
  BriefcaseBusiness,
  BarChart3,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  {
    path: "/bde/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    path: "/bde/leads",
    label: "Leads",
    icon: Users,
  },
  {
    path: "/bde/employees",
    label: "Employees",
    icon: BriefcaseBusiness,
  },
  {
    path: "/bde/reports",
    label: "Reports",
    icon: BarChart3,
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-65
          bg-gradient-to-b from-[var(--primary-700)] via-[var(--primary-800)] to-black
          text-white flex flex-col border-r border-white/10 shadow-2xl
          transition-transform duration-300
          lg:relative lg:translate-x-0 lg:shrink-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between px-5 h-16 border-b border-white/10"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center overflow-hidden shadow-lg">
              <img
                src="/mylogo.png"
                alt="Logo"
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>

            <div>
              <h2 className="text-lg font-black tracking-wide leading-tight">
                EPHORSYS
              </h2>

              <p className="text-[11px] uppercase tracking-[3px] text-slate-300">
                CRM PANEL
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden w-9 h-9 rounded-xl hover:bg-white/10 transition flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </motion.div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {NAV_ITEMS.map(({ path, label, icon: Icon }, i) => (
            <motion.div
              key={path}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: i * 0.08,
                duration: 0.3,
              }}
            >
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `
                  flex items-center gap-3 px-4 py-3 rounded-2xl
                  text-sm font-medium transition-all duration-300

                  ${
                    isActive
                      ? "bg-white text-[var(--primary-700)] shadow-lg"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }
                `
                }
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-md">

          {/* Logout */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="
              w-full flex items-center justify-center gap-3
              py-2 rounded-2xl cursor-pointer
              bg-[var(--primary)]
              hover:bg-[var(--primary-500)]
              transition-all duration-300
              font-medium shadow-lg shadow-[var(--primary)]/30
            "
          >
            <LogOut size={18} />
            Logout
          </motion.button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;