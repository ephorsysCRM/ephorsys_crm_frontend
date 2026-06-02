import { LogOut, X } from "lucide-react";

import { motion } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/authSlice";

const LogoutModal = ({ onClose }) => {
  // ==================================================
  // Hooks
  // ==================================================

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ==================================================
  // Redux State
  // ==================================================

  // (Optional: remove loading if not needed, or fallback to false if undefined)
  const loading = false; 

  // ==================================================
  // Handle Logout
  // ==================================================

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="w-full">
      {/* Content */}
      <div className="mt-6 text-center">
        <h2 className="text-2xl font-bold text-[var(--primary-700)]">
          Logout Account
        </h2>

        <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-sm mx-auto">
          Are you sure you want to logout
          from your CRM account?
        </p>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 mt-8">
        {/* Cancel */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onClose}
          disabled={loading}
          className="
            h-12
            rounded-2xl
            border border-[var(--primary-100)]
            bg-white
            hover:bg-[var(--primary-50)]
            text-sm font-semibold
            text-[var(--primary-700)]
            transition-all duration-300
            cursor-pointer
            flex items-center justify-center gap-2
            shadow-sm
            disabled:opacity-60
            disabled:cursor-not-allowed
          "
        >
          <X size={17} />
          Cancel
        </motion.button>

        {/* Logout */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          disabled={loading}
          className="
            h-12
            rounded-2xl
            bg-gradient-to-r
            from-[var(--primary-600)]
            to-[var(--primary-500)]
            hover:from-[var(--primary-700)]
            hover:to-[var(--primary-600)]
            text-white
            text-sm font-semibold
            transition-all duration-300
            cursor-pointer
            flex items-center justify-center gap-2
            shadow-lg shadow-[var(--primary-600)]/30
            disabled:opacity-70
            disabled:cursor-not-allowed
          "
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />

              Logging Out...
            </>
          ) : (
            <>
              <LogOut size={17} />
              Logout
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default LogoutModal;