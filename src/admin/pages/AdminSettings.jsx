import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  KeyRound,
  User,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  BadgeCheck,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import api from "../../services/api";

// ─── Toast component ─────────────────────────────────────────────────────────
const Toast = ({ toast }) => {
  if (!toast) return null;
  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
        toast.type === "error"
          ? "bg-red-50 text-red-700 border border-red-200"
          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
      }`}
    >
      {toast.type === "error" ? <AlertCircle size={16} /> : <BadgeCheck size={16} />}
      {toast.msg}
    </div>
  );
};

// ─── Admin Settings Page ─────────────────────────────────────────────────────
const AdminSettings = () => {
  const { user } = useSelector((state) => state.auth);

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [profileSaving, setProfileSaving] = useState(false);

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Update profile (name / email) ─────────────────────────────────────────
  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      showToast("Name and email are required", "error");
      return;
    }
    setProfileSaving(true);
    try {
      await api.patch("/admin/update", {
        name: profileForm.name,
        email: profileForm.email,
      });
      showToast("Profile updated successfully");
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to update profile", "error");
    } finally {
      setProfileSaving(false);
    }
  };

  // ── Update password ───────────────────────────────────────────────────────
  const handlePasswordSave = async (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = passwordForm;
    if (!newPassword || !confirmPassword) {
      showToast("Both password fields are required", "error");
      return;
    }
    if (/\s/.test(newPassword)) {
      showToast("Password must not contain spaces", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }
    setPasswordSaving(true);
    try {
      await api.patch("/admin/update", { newPassword, confirmPassword });
      showToast("Password updated successfully");
      setPasswordForm({ newPassword: "", confirmPassword: "" });
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to update password", "error");
    } finally {
      setPasswordSaving(false);
    }
  };

  const getInitials = (name = "A") =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50">
      <Toast toast={toast} />

      {/* Page header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5">
        <h1 className="text-xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage your admin profile and account security</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 space-y-6">

        {/* Admin identity card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
            <span className="text-white font-bold text-xl">{getInitials(user?.name)}</span>
          </div>
          <div>
            <p className="font-bold text-slate-900 text-lg">{user?.name || "Admin"}</p>
            <p className="text-sm text-slate-500">{user?.email || "—"}</p>
            <span className="inline-flex items-center gap-1 mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
              <ShieldCheck size={11} /> Administrator
            </span>
          </div>
        </div>

        {/* ── Profile Details ─────────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <User size={16} className="text-indigo-600" />
            </div>
            <h2 className="font-semibold text-slate-800 text-sm">Profile Details</h2>
          </div>
          <form onSubmit={handleProfileSave} className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name */}
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1 block">
                  Full Name
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Admin name"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="admin@example.com"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={profileSaving}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition shadow-sm"
              >
                {profileSaving ? <Loader2 size={15} className="animate-spin" /> : <BadgeCheck size={15} />}
                {profileSaving ? "Saving…" : "Save Profile"}
              </button>
            </div>
          </form>
        </div>

        {/* ── Change Password ──────────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-amber-50">
            <div className="p-2 bg-amber-100 rounded-lg">
              <KeyRound size={16} className="text-amber-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-800 text-sm">Change Password</h2>
              <p className="text-xs text-slate-400 mt-0.5">Update your admin account password</p>
            </div>
          </div>
          <form onSubmit={handlePasswordSave} className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* New Password */}
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1 block">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm((f) => ({ ...f, newPassword: e.target.value.replace(/\s/g, "") }))
                    }
                    placeholder="Enter new password (no spaces)"
                    autoComplete="new-password"
                    className="w-full px-3 py-2.5 pr-10 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1 block">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((f) => ({ ...f, confirmPassword: e.target.value.replace(/\s/g, "") }))
                    }
                    placeholder="Confirm new password (no spaces)"
                    autoComplete="new-password"
                    className="w-full px-3 py-2.5 pr-10 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Mismatch hint */}
            {passwordForm.confirmPassword &&
              passwordForm.newPassword !== passwordForm.confirmPassword && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={12} /> Passwords do not match
                </p>
              )}

            {/* Strength hint */}
            {passwordForm.newPassword && passwordForm.newPassword.length < 6 && (
              <p className="text-xs text-amber-600 flex items-center gap-1">
                <AlertCircle size={12} /> Password must be at least 6 characters
              </p>
            )}

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={passwordSaving}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition shadow-sm"
              >
                {passwordSaving ? <Loader2 size={15} className="animate-spin" /> : <KeyRound size={15} />}
                {passwordSaving ? "Updating…" : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
