import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Lock,
  Mail,
  Users,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  Shield,
} from "lucide-react";
import { loginSuccess } from "../redux/features/auth/authSlice";
import { joinUserRoom } from "../services/authSocket";
import api from "../services/api";

// ─── Forgot Password Modal ─────────────────────────────────────────────────────
const ForgotPasswordModal = ({ onClose }) => {
  // Steps: "email" → "otp" → "reset" → "success"
  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef([]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // Auto-focus first OTP box when entering otp step
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  const handleOtpChange = (idx, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = pasted.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtp(next);
    const lastIdx = Math.min(pasted.length, 5);
    otpRefs.current[lastIdx]?.focus();
    e.preventDefault();
  };

  // Step 1 – Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error("Please enter your email");
    setLoading(true);
    try {
      await api.post("/admin/forget-password", { email: email.trim() });
      toast.success("OTP sent! Check your inbox.");
      setStep("otp");
      setCountdown(60);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setLoading(true);
    try {
      await api.post("/admin/forget-password", { email: email.trim() });
      toast.success("New OTP sent!");
      setOtp(["", "", "", "", "", ""]);
      setCountdown(60);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 – Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpStr = otp.join("");
    if (otpStr.length < 6) return toast.error("Please enter the complete 6-digit OTP");
    setLoading(true);
    try {
      const res = await api.post("/admin/verify-reset-otp", { email, otp: otpStr });
      setResetToken(res.data.data.resetToken);
      toast.success("OTP verified successfully!");
      setStep("reset");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired OTP");
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } finally {
      setLoading(false);
    }
  };

  // Step 3 – Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return toast.error("Please fill in all fields");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
    if (newPassword.length < 8) return toast.error("Password must be at least 8 characters");
    setLoading(true);
    try {
      await api.post("/admin/reset-password", {
        email,
        resetToken,
        password: newPassword,
        confirmPassword,
      });
      toast.success("Password reset successfully!");
      setStep("success");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const stepMeta = [
    { label: "Email", done: step !== "email" },
    { label: "OTP", done: step === "reset" || step === "success" },
    { label: "Reset", done: step === "success" },
  ];

  return (
    <div className="fp-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="fp-modal">
        {/* Close button */}
        <button className="fp-close" onClick={onClose} aria-label="Close">×</button>

        {/* Step indicators */}
        {step !== "success" && (
          <div className="fp-steps">
            {stepMeta.map((s, i) => (
              <div key={i} className={`fp-step ${s.done ? "done" : ""} ${stepMeta.indexOf(stepMeta.find((_, idx) => idx === i && !s.done && (i === 0 ? step === "email" : i === 1 ? step === "otp" : step === "reset")) !== -1) ? "" : ""}`}>
                <div className={`fp-step-circle ${s.done ? "fp-step-done" : step === (i === 0 ? "email" : i === 1 ? "otp" : "reset") ? "fp-step-active" : ""}`}>
                  {s.done ? <CheckCircle2 size={14} /> : <span>{i + 1}</span>}
                </div>
                <span className="fp-step-label">{s.label}</span>
                {i < 2 && <div className={`fp-step-line ${s.done ? "fp-step-line-done" : ""}`} />}
              </div>
            ))}
          </div>
        )}

        {/* ── Step: Email ─────────────────────────────────── */}
        {step === "email" && (
          <form className="fp-form" onSubmit={handleSendOtp}>
            <div className="fp-icon-wrap fp-icon-blue">
              <Mail size={28} />
            </div>
            <h2 className="fp-title">Forgot Password?</h2>
            <p className="fp-subtitle">Enter your admin email and we'll send you a 6-digit OTP to reset your password.</p>

            <div className="fp-field">
              <label className="fp-label">Admin Email</label>
              <div className="fp-input-wrap">
                <Mail size={17} className="fp-input-icon" />
                <input
                  type="email"
                  className="fp-input"
                  placeholder="admin@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            <button type="submit" className="fp-btn-primary" disabled={loading}>
              {loading ? <span className="fp-spinner" /> : "Send OTP"}
            </button>

            <button type="button" className="fp-btn-ghost" onClick={onClose}>
              <ArrowLeft size={16} /> Back to Login
            </button>
          </form>
        )}

        {/* ── Step: OTP ───────────────────────────────────── */}
        {step === "otp" && (
          <form className="fp-form" onSubmit={handleVerifyOtp}>
            <div className="fp-icon-wrap fp-icon-amber">
              <KeyRound size={28} />
            </div>
            <h2 className="fp-title">Enter OTP</h2>
            <p className="fp-subtitle">
              We sent a 6-digit code to <strong className="fp-email-highlight">{email}</strong>. It expires in 10 minutes.
            </p>

            <div className="fp-otp-row" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className={`fp-otp-box ${digit ? "fp-otp-filled" : ""}`}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                />
              ))}
            </div>

            <button type="submit" className="fp-btn-primary" disabled={loading || otp.join("").length < 6}>
              {loading ? <span className="fp-spinner" /> : "Verify OTP"}
            </button>

            <div className="fp-resend-row">
              <span className="fp-resend-text">Didn't receive it?</span>
              <button
                type="button"
                className={`fp-resend-btn ${countdown > 0 ? "fp-resend-disabled" : ""}`}
                onClick={handleResendOtp}
                disabled={countdown > 0 || loading}
              >
                <RefreshCw size={13} />
                {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
              </button>
            </div>

            <button type="button" className="fp-btn-ghost" onClick={() => setStep("email")}>
              <ArrowLeft size={16} /> Change Email
            </button>
          </form>
        )}

        {/* ── Step: Reset Password ────────────────────────── */}
        {step === "reset" && (
          <form className="fp-form" onSubmit={handleResetPassword}>
            <div className="fp-icon-wrap fp-icon-green">
              <Shield size={28} />
            </div>
            <h2 className="fp-title">Set New Password</h2>
            <p className="fp-subtitle">Create a strong new password for your admin account.</p>

            <div className="fp-field">
              <label className="fp-label">New Password</label>
              <div className="fp-input-wrap">
                <Lock size={17} className="fp-input-icon" />
                <input
                  type={showNew ? "text" : "password"}
                  className="fp-input fp-input-pr"
                  placeholder="Min. 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  autoFocus
                />
                <button type="button" className="fp-eye-btn" onClick={() => setShowNew(!showNew)}>
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {newPassword && (
                <div className="fp-strength-bar">
                  <div className={`fp-strength-fill fp-strength-${newPassword.length < 8 ? "weak" : newPassword.length < 12 ? "medium" : "strong"}`} />
                </div>
              )}
            </div>

            <div className="fp-field">
              <label className="fp-label">Confirm Password</label>
              <div className="fp-input-wrap">
                <Lock size={17} className="fp-input-icon" />
                <input
                  type={showConfirm ? "text" : "password"}
                  className={`fp-input fp-input-pr ${confirmPassword && newPassword !== confirmPassword ? "fp-input-error" : ""}`}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button type="button" className="fp-eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <span className="fp-error-msg">Passwords do not match</span>
              )}
            </div>

            <button type="submit" className="fp-btn-primary" disabled={loading}>
              {loading ? <span className="fp-spinner" /> : "Reset Password"}
            </button>
          </form>
        )}

        {/* ── Step: Success ───────────────────────────────── */}
        {step === "success" && (
          <div className="fp-form fp-success">
            <div className="fp-success-icon">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="fp-title">Password Reset!</h2>
            <p className="fp-subtitle">Your admin password has been updated successfully. You can now sign in with your new password.</p>
            <button className="fp-btn-primary" onClick={onClose}>
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Login Page ───────────────────────────────────────────────────────────
const Login = () => {
  const [roleMode, setRoleMode] = useState("employee");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const rehydrated = useSelector((state) => state._persist?.rehydrated);
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  useEffect(() => {
    if (rehydrated && isAuthenticated) {
      navigate(role === "admin" ? "/admin/dashboard" : "/bde/dashboard");
    }
  }, [rehydrated, isAuthenticated, role, navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const endpoint = roleMode === "admin" ? "/admin/login" : "/employee/login";
      const payload =
        roleMode === "admin"
          ? { email: data.email, password: data.password }
          : { officialEmail: data.email, password: data.password };

      const response = await api.post(endpoint, payload);

      if (response.data.success) {
        if (roleMode === "employee" && response.data.data.department !== "Business Development Executive") {
          toast.error("Access restricted to Business Development Executives only");
          return;
        }

        dispatch(loginSuccess({ user: response.data.data, role: roleMode }));
        joinUserRoom(response.data.data._id);
        toast.success(`Welcome back, ${response.data.data.firstName || response.data.data.name}!`);
        navigate(roleMode === "admin" ? "/admin/dashboard" : "/bde/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gradient-to-br from-zinc-900 to-black border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-8 text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-[#74C316]/10 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8 text-[#8fbf4a]" />
          </div>

        {/* Role Toggles */}
        <div className="px-8 flex space-x-2 mb-6">
          <button 
            type="button"
            onClick={() => setRoleMode("employee")}
            className={`flex-1 py-2.5 rounded-lg flex items-center justify-center space-x-2 text-sm font-medium transition-all ${
              roleMode === "employee" 
                ? "bg-[#74C316] text-white shadow-lg shadow-[#74C316]/30" 
                : "bg-slate-800/50 text-white hover:bg-[#74C316]/20"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Employee</span>
          </button>
          <button 
            type="button"
            onClick={() => setRoleMode("admin")}
            className={`flex-1 py-2.5 rounded-lg flex items-center justify-center space-x-2 text-sm font-medium transition-all ${
              roleMode === "admin" 
                ? "bg-[#74C316] text-white shadow-lg shadow-[#74C316]/30" 
                : "bg-slate-800/50 text-white hover:bg-[#74C316]/20"
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Admin</span>
          </button>
        </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            {/* Email */}
            <div className="form-field">
              <label className="form-label">
                {roleMode === "admin" ? "Admin Email" : "Official Email"}
              </label>
              <div className="form-input-wrap">
                <Mail size={16} className="form-input-icon" />
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="form-input"
                  placeholder={roleMode === "admin" ? "admin@company.com" : "employee@company.com"}
                />
              </div>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-700 rounded-xl bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#74C316] focus:border-transparent transition-all"
                placeholder={roleMode === "admin" ? "admin@company.com" : "employee@company.com"}
              />
            </div>

            {/* Password */}
            <div className="form-field">
              <label className="form-label">Password</label>
              <div className="form-input-wrap">
                <Lock size={16} className="form-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: "Password is required" })}
                  className="form-input pr"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="form-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password.message}</span>}
            </div>

            {/* Forgot password – Admin only */}
            {roleMode === "admin" && (
              <button
                type="button"
                className="forgot-link"
                onClick={() => setShowForgotModal(true)}
              >
                Forgot password?
              </button>
            )}

    <input
      type={showPassword ? "text" : "password"}
      {...register("password", { required: "Password is required" })}
      className="block w-full pl-10 pr-12 py-2.5 border border-slate-700 rounded-xl bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#74C316] focus:border-transparent transition-all"
      placeholder="••••••••"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
    >
      {showPassword ? (
        <EyeOff className="h-5 w-5" />
      ) : (
        <Eye className="h-5 w-5" />
      )}
    </button>
  </div>

  {errors.password && (
    <span className="text-red-400 text-xs mt-1 block">
      {errors.password.message}
    </span>
  )}
</div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-[#74C316] hover:bg-[#63A613] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#74C316] focus:ring-offset-slate-900 transition-all disabled:opacity-50 flex justify-center items-center"
          >
            {isLoading ? (
               <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : "Sign In"}
          </button>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />}
    </>
  );
};

export default Login;