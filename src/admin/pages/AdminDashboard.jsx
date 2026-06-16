import React from "react";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-sm text-slate-500">
            Overview of employees, attendance, payroll and activities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            ["Total Employees", "15", "👥"],
            ["Active Employees", "15", "✅"],
            ["Pending Leaves", "12", "📝"],
            ["Payroll Processed", "₹8.4L", "💰"],
          ].map(([title, value, icon]) => (
            <div
              key={title}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{title}</p>
                  <h2 className="text-2xl font-bold text-slate-900 mt-1">
                    {value}
                  </h2>
                </div>
                <div className="h-11 w-11 rounded-xl bg-indigo-50 flex items-center justify-center text-xl">
                  {icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Recent Employees
            </h2>

            <div className="space-y-3">
              {["Rahul Sharma", "Priya Das", "Amit Kumar", "Sneha Patra"].map(
                (name, index) => (
                  <div
                    key={name}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">
                        {name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{name}</p>
                        <p className="text-xs text-slate-500">
                          Software Developer
                        </p>
                      </div>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-medium">
                      Active
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Quick Actions
            </h2>

            <div className="space-y-3">
              {["Add Employee", "Manage Payroll", "Approve Leave", "View Reports"].map(
                (item) => (
                  <button
                    key={item}
                    className="w-full text-left px-4 py-3 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-medium transition"
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;