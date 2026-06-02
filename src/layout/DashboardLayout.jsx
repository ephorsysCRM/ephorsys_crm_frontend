import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { 
  LayoutDashboard, 
  Users, 
  LogOut, 
  Menu, 
  X, 
  Flame, 
  Kanban,
  PlusCircle
} from "lucide-react";
import { useState } from "react";
import { logout } from "../redux/authSlice";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Leads Pipeline", path: "/leads/pipeline", icon: Kanban },
    { name: "Hotlist", path: "/leads/hotlist", icon: Flame },
    { name: "All Leads", path: "/leads", icon: Users },
  ];

  if (role === "employee") {
    navLinks.splice(1, 0, { name: "Create Lead", path: "/leads/create", icon: PlusCircle });
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        flex flex-col
      `}>
        <div className="h-16 flex items-center px-6 border-b border-slate-800 font-bold text-xl text-indigo-400">
          CRM Portal
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/20" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{link.name}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center px-4 py-3 bg-slate-800/50 rounded-xl mb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold mr-3">
              {(user?.firstName || user?.name || "U")[0].toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.firstName || user?.name}</p>
              <p className="text-xs text-slate-400 capitalize">{role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-red-400 bg-red-400/10 hover:bg-red-400/20 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-10 shrink-0">
          <button 
            className="lg:hidden text-slate-500 hover:text-slate-700"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="ml-auto flex items-center space-x-4">
            <div className="text-sm font-medium text-slate-700 hidden sm:block">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;
