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
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/authSlice";
import Modal from "../../components/ui/Modal";
import LogoutModal from "../../components/Modals/LogoutModal";

const TopBar = ({ setSidebarOpen }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const auth = useSelector((state) => state.auth);

  const user = auth?.admin?.user;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("persist:root");
    navigate("/");
  };
  const [isFullscreen, setIsFullscreen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fullscreen Toggle
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Current Date
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
      transition={{
        duration: 0.4,
        ease: "easeOut",
      }}
      className="
        relative z-10
        bg-white
        border-b border-slate-200
        px-4 md:px-6
        h-16
        flex items-center justify-between
        shrink-0
      "
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          className="
            lg:hidden
            w-9 h-9
            flex items-center justify-center
            rounded-lg
            border border-slate-200
            text-slate-500
            hover:bg-slate-50
            transition
          "
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu size={18} />
        </motion.button>

        {/* Brand */}
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.1,
            ease: "easeOut",
          }}
          className="
            text-[15px]
            font-semibold
            tracking-widest
            text-[var(--primary)]
          "
        >
          EPHORSYS
        </motion.span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Calendar */}
        <div
          className="
            hidden md:flex
            items-center gap-2
            px-3 py-2
            rounded-xl
            bg-[var(--primary-50)]
            border border-[var(--primary-100)]
          "
        >
          <CalendarDays size={15} className="text-[var(--primary-600)]" />

          <span className="text-xs font-medium text-[var(--primary-700)]">
            {today}
          </span>
        </div>

        {/* Fullscreen */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={toggleFullscreen}
          className="
            w-9 h-9 cursor-pointer
            rounded-lg
            border border-slate-200
            flex items-center justify-center
            text-slate-500
            hover:bg-slate-50
            transition
          "
        >
          {isFullscreen ? (
            <Minimize size={18} className="text-[var(--primary-600)]" />
          ) : (
            <Maximize size={18} className="text-[var(--primary-600)]" />
          )}
        </motion.button>

        {/* Profile */}
        <div className="relative" ref={dropdownRef}>
          <motion.button
            onClick={() => setProfileOpen((o) => !o)}
            whileTap={{ scale: 0.97 }}
            className="
              flex items-center gap-2
              px-2 py-1
              rounded-xl
              hover:bg-slate-50
              transition
              cursor-pointer
            "
          >
            {/* User Info */}
            <div className="hidden sm:block text-right">
              <p className="text-[13px] font-medium text-slate-800 leading-tight">
                {user?.firstName || user?.lastName || "User"}
              </p>

              <p className="text-[11px] uppercase tracking-wider text-slate-400 leading-tight">
                BDE
              </p>
            </div>

            {/* Avatar */}
            <div
              className="
                w-9 h-9
                rounded-full
                bg-[var(--primary-100)]
                border border-[var(--primary-200)]
                flex items-center justify-center
                text-[var(--primary-700)]
              "
            >
              <User size={16} />
            </div>
          </motion.button>

          {/* Dropdown */}
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -8,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                  scale: 0.96,
                }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                }}
                className="
                  absolute right-0 mt-2.5
                  w-56
                  bg-white
                  border border-slate-200
                  rounded-xl
                  shadow-sm
                  overflow-hidden
                  z-50
                "
              >
                {/* Identity */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
                  <div
                    className="
                      w-10 h-10
                      rounded-full
                      bg-[var(--primary-100)]
                      border border-[var(--primary-200)]
                      flex items-center justify-center
                      text-[var(--primary-700)]
                    "
                  >
                    <User size={16} />
                  </div>

                  <div>
                    <p className="text-[13px] font-medium text-slate-800 leading-tight">
                      {user?.firstName || user?.name || "User"}
                    </p>

                    <p className="text-xs text-slate-400">
                      {user?.officialEmail || user?.email || ""}
                    </p>
                  </div>
                </div>

                {/* Profile Button */}
                <div className="p-1.5">
                  <motion.button
                    whileHover={{
                      backgroundColor: "#f8fafc",
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="
                      w-full
                      flex items-center gap-2.5
                      px-3 py-2.5
                      rounded-lg
                      text-[13px]
                      text-slate-700
                      transition
                    "
                  >
                    <User size={15} className="text-slate-400" />
                    My Profile
                  </motion.button>
                </div>

                {/* Logout */}
                <div className="border-t border-slate-100 p-1.5">
  <motion.button
    onClick={() => setLogoutOpen(true)}
    whileHover={{
      backgroundColor: "#fef2f2",
    }}
    whileTap={{ scale: 0.98 }}
    className="
      w-full
      flex items-center gap-2.5
      px-3 py-2.5
      rounded-lg
      text-[13px]
      text-red-500
      transition
      cursor-pointer
    "
  >
    <LogOut size={15} />
    Sign out
  </motion.button>
</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Modal
  isOpen={logoutOpen}
  onClose={() => setLogoutOpen(false)}
  title="Logout"
  size="sm"
>
  <LogoutModal onClose={() => setLogoutOpen(false)} />
</Modal>
    </motion.header>
  );
};

export default TopBar;
