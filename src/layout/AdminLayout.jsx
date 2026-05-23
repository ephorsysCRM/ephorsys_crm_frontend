import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminTopBar from "../admin/components/AdminTopBar";
import AdminSidebar from "../admin/components/AdminSidebar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopBar setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;