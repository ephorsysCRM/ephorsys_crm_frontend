import {
  Menu,
  User,
  LogOut,
  CalendarDays,
  Maximize,
  Minimize,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../../components/ui/Modal";
import LogoutModal from "../../components/Modals/LogoutModal";

const AdminTopBar = ({ setSidebarOpen }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);



  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-[var(--border-color)] px-4 md:px-6 h-16 flex items-center justify-between"
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden w-10 h-10 rounded-xl border border-[var(--border-color)] flex items-center justify-center text-[var(--primary)]"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={18} />
        </button>

        <div>
          <h1 className="text-sm md:text-base font-bold tracking-widest text-[var(--primary)]">
            EPHORSYS CRM
          </h1>
          <p className="text-[11px] text-slate-500 hidden sm:block">
            Welcome Back
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Calendar */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--primary-50)] border border-[var(--primary-100)]">
          <CalendarDays
            size={16}
            className="text-[var(--primary-600)]"
          />
          <span className="text-xs font-medium text-[var(--primary-700)]">
            {today}
          </span>
        </div>

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="w-10 h-10 rounded-xl border border-[var(--border-color)] hover:bg-[var(--primary-50)] flex items-center justify-center transition cursor-pointer"
        >
          {isFullscreen ? (
            <Minimize
              size={18}
              className="text-[var(--primary-600)]"
            />
          ) : (
            <Maximize
              size={18}
              className="text-[var(--primary-600)]"
            />
          )}
        </button>

        {/* Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-2xl hover:bg-[var(--primary-50)] transition"
          >
            <div className="hidden sm:block text-right">
              <p className="text-[13px] font-semibold text-slate-800">
                Manoj
              </p>
              <p className="text-[11px] uppercase tracking-wider text-slate-400">
                Admin
              </p>
            </div>

            <div className="w-10 h-10 rounded-full bg-[var(--primary-100)] border border-[var(--primary-200)] flex items-center justify-center text-[var(--primary-700)]">
              <User size={18} />
            </div>
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute right-0 mt-3 w-60 bg-white border border-[var(--border-color)] rounded-2xl shadow-xl overflow-hidden"
              >
                {/* Top */}
                <div className="p-4 bg-[var(--primary-50)] border-b border-[var(--primary-100)]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[var(--primary)] text-white flex items-center justify-center">
                      <User size={18} />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">
                        Manoj Kumar
                      </h3>
                      <p className="text-xs text-slate-500">
                        Super Admin
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu */}
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--primary-50)] transition text-sm text-slate-700">
                    <User size={16} />
                    My Profile
                  </button>
                </div>

                {/* Logout */}
                <div className="p-2 border-t border-slate-100">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 transition text-sm text-red-500"
                    onClick={() => setLogoutOpen(true)}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>


        {/* Logout Modal */}
        <Modal
          isOpen={logoutOpen}
          onClose={() => setLogoutOpen(false)}
          title="Logout"
          size="sm"
        >
          <LogoutModal
            onClose={() => setLogoutOpen(false)}
          />
        </Modal>
      </div>
    </motion.header>
  );
};

export default AdminTopBar;