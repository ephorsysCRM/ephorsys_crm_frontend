import {
  LayoutDashboard,
  LogOut,
  X,
  Users,
  BriefcaseBusiness,
  BarChart3,
  Trophy,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Modal from "../../components/ui/Modal";
import LogoutModal from "../../components/Modals/LogoutModal";
import logo from "../../assets/logo.png";

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
    path: "/bde/happy-clients",
    label: "Happy Clients",
    icon: Trophy,
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [logoutOpen, setLogoutOpen] = useState(false);

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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-65
          bg-[#071E0F]
          text-white flex flex-col border-r border-[#74C316]/20 shadow-2xl
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
          className="flex items-center justify-between px-5 h-20  mb-2"
        >
          <div className="flex items-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-white/5 mr-1">
              <img
                src={logo}
                alt="logo"
                className="w-full h-full object-contain p-1.5"
              />
            </div>

            <div>
              <h2 className="text-lg font-black tracking-wide leading-tight text-white ml-1">
                EPHORSYS
              </h2>

              <p className="text-[11px] uppercase tracking-[3px] text-[#74C316] ml-1">
                CRM PANEL
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden w-9 h-9 rounded-xl hover:bg-[#74C316]/15 transition flex items-center justify-center text-slate-300 hover:text-[#74C316]"
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
                  group flex items-center gap-3 px-4 py-3 rounded-2xl
                  text-sm font-medium transition-all duration-300 relative overflow-hidden

                  ${
                    isActive
                      ? "bg-[#74C316] text-black shadow-lg shadow-[#74C316]/30"
                      : "text-slate-300 hover:bg-[#74C316]/10 hover:text-[#74C316]"
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
        <div className="p-4 border-t border-[#74C316]/20 bg-black/30 backdrop-blur-md">
          {/* Logout */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setLogoutOpen(true)}
            className="
              w-full flex items-center justify-center gap-3
              py-2.5 rounded-2xl cursor-pointer
              bg-[#74C316] text-black
              hover:bg-[#8AD62E]
              transition-all duration-300
              font-semibold shadow-lg shadow-[#74C316]/30
            "
          >
            <LogOut size={18} />
            Logout
          </motion.button>
        </div>

        {/* Logout Modal */}
        <Modal
          isOpen={logoutOpen}
          onClose={() => setLogoutOpen(false)}
          title="Logout"
          size="sm"
        >
          <LogoutModal onClose={() => setLogoutOpen(false)} />
        </Modal>
      </aside>
    </>
  );
};

export default Sidebar;