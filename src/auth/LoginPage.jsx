import { motion } from "framer-motion";

import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Loader2,
  LogIn,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../redux/features/auth/authThunk";


const LoginPage = () => {
  // ==================================================
  // Hooks
  // ==================================================

  const dispatch = useDispatch();

  const navigate = useNavigate();

  // ==================================================
  // Redux State
  // ==================================================

  const {
    admin,
    loading,
    isAuthenticated,
  } = useSelector(
    (state) => state.auth
  );

  // ==================================================
  // States
  // ==================================================

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  // ==================================================
  // Handle Login
  // ==================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = {
      email,
      password,
    };

    dispatch(loginAdmin(formData));
  };

  // ==================================================
  // Role Based Redirect
  // ==================================================

  useEffect(() => {
    if (
      isAuthenticated &&
      admin?.role
    ) {
      switch (admin.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "bde":
          navigate("/bde/dashboard");
          break;
        default:
          navigate("/");
      }
    }
  }, [
    isAuthenticated,
    admin,
    navigate,
  ]);

  // ==================================================
  // Validation
  // ==================================================

  const isValid =
    email !== "" &&
    password !== "";

  return (
    <div
      className="
        min-h-screen
        flex items-center justify-center
        px-4 py-10
        bg-gradient-to-br
        from-[var(--primary-50)]
        via-white
        to-[var(--primary-100)]
        relative overflow-hidden
      "
    >
      {/* Blur Effects */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[var(--primary-200)] rounded-full blur-3xl opacity-20" />

      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[var(--primary-300)] rounded-full blur-3xl opacity-20" />

      {/* Login Card */}
      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="
          relative z-10
          w-full max-w-md
          bg-white/90
          backdrop-blur-xl
          border border-[var(--primary-100)]
          rounded-3xl
          shadow-2xl
          overflow-hidden
        "
      >
        {/* Header */}
        <div
          className="
            px-8 pt-8 pb-7
            bg-gradient-to-r
            from-[var(--primary-700)]
            to-[var(--primary-500)]
            text-white
          "
        >
          <h1 className="text-3xl font-black tracking-wide">
            EPHORSYS
          </h1>

          <p className="text-sm text-white/80 mt-2">
            CRM Admin Login Panel
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          {/* Heading */}
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-slate-800">
              Welcome Back
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Login to continue your dashboard
            </p>
          </div>

          {/* Form */}
          <motion.form
            onSubmit={handleLogin}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.6,
            }}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Email Address
              </label>

              <div
                className="
                  relative
                  h-12
                  rounded-2xl
                  border border-slate-200
                  bg-white
                  flex items-center
                  px-4
                  transition
                  focus-within:border-[var(--primary-400)]
                  focus-within:ring-4
                  focus-within:ring-[var(--primary-100)]
                "
              >
                <Mail
                  size={18}
                  className="text-slate-400"
                />

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="
                    flex-1
                    bg-transparent
                    outline-none
                    px-3
                    text-sm
                    text-slate-700
                    placeholder:text-slate-400
                  "
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>

                <button
                  type="button"
                  className="
                    text-xs
                    font-medium
                    text-[var(--primary-600)]
                    hover:underline
                  "
                >
                  Forgot Password?
                </button>
              </div>

              <div
                className="
                  relative
                  h-12
                  rounded-2xl
                  border border-slate-200
                  bg-white
                  flex items-center
                  px-4
                  transition
                  focus-within:border-[var(--primary-400)]
                  focus-within:ring-4
                  focus-within:ring-[var(--primary-100)]
                "
              >
                <Lock
                  size={18}
                  className="text-slate-400"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  className="
                    flex-1
                    bg-transparent
                    outline-none
                    px-3
                    text-sm
                    text-slate-700
                    placeholder:text-slate-400
                  "
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="
                    text-slate-400
                    hover:text-slate-600
                    transition
                  "
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <motion.button
              whileHover={{
                scale: 1.01,
              }}
              whileTap={{
                scale: 0.98,
              }}
              type="submit"
              disabled={
                !isValid || loading
              }
              className={`
                w-full
                h-13
                rounded-2xl
                font-semibold
                text-sm
                transition-all duration-300
                flex items-center justify-center gap-2
                shadow-lg
                ${isValid
                  ? `
                      bg-gradient-to-r
                      from-[var(--primary-700)]
                      to-[var(--primary-500)]
                      hover:from-[var(--primary-800)]
                      hover:to-[var(--primary-600)]
                      text-white
                      shadow-[var(--primary-600)]/30
                    `
                  : `
                      bg-slate-200
                      text-slate-400
                      cursor-not-allowed
                    `
                }
              `}
            >
              {loading ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </motion.button>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;