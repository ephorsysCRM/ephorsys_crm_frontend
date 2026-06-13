import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Lock, Mail, Users, ShieldCheck } from "lucide-react";
import { loginSuccess } from "../../redux/authSlice";
import { joinUserRoom } from "../../services/authSocket";
import api from "../../services/api";

const Login = () => {
  const [roleMode, setRoleMode] = useState("employee"); // "employee" or "admin"
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(role === "admin" ? "/admin/dashboard" : "/bde/dashboard");
    }
  }, [isAuthenticated, role, navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const endpoint = roleMode === "admin" ? "/admin/login" : "/employee/login";
      
      const payload = roleMode === "admin" 
        ? { email: data.email, password: data.password } 
        : { officialEmail: data.email, password: data.password };

      const response = await api.post(endpoint, payload);

      if (response.data.success) {
        // Employee logic - Check department
        if (roleMode === "employee" && response.data.data.department !== "Business Development Executive") {
            toast.error("Access restricted to Business Development Executives only");
            return;
        }

        dispatch(loginSuccess({
          user: response.data.data,
          role: roleMode
        }));
        
        // Connect socket and join user room for real-time updates
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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-8 text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">CRM Portal Login</h2>
          <p className="text-slate-400 text-sm">Sign in to manage your leads and pipeline</p>
        </div>

        {/* Role Toggles */}
        <div className="px-8 flex space-x-2 mb-6">
          <button 
            type="button"
            onClick={() => setRoleMode("employee")}
            className={`flex-1 py-2.5 rounded-lg flex items-center justify-center space-x-2 text-sm font-medium transition-all ${
              roleMode === "employee" 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" 
                : "bg-slate-800 text-slate-400 hover:bg-slate-750"
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
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" 
                : "bg-slate-800 text-slate-400 hover:bg-slate-750"
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Admin</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-8 pb-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              {roleMode === "admin" ? "Admin Email" : "Official Email"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-700 rounded-xl bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder={roleMode === "admin" ? "admin@company.com" : "employee@company.com"}
              />
            </div>
            {errors.email && <span className="text-red-400 text-xs mt-1 block">{errors.email.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="password"
                {...register("password", { required: "Password is required" })}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-700 rounded-xl bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
            {errors.password && <span className="text-red-400 text-xs mt-1 block">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 focus:ring-offset-slate-900 transition-all disabled:opacity-50 flex justify-center items-center"
          >
            {isLoading ? (
               <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
