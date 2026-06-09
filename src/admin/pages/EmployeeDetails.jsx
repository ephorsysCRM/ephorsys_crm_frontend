import React, { useEffect, useState } from "react";
import {
  Search,
  Users,
  Mail,
  Phone,
  Building2,
  Briefcase,
  MapPin,
  Loader2,
  Eye,
  Filter,
  IdCard,
  IdCardLanyardIcon,
  IdCardIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEmployees } from "../../redux/features/employeeSlice";

const EmployeeDetails = () => {
  const dispatch = useDispatch();
  const { employees, loading } = useSelector((state) => state.employee);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    department: "",
    employmentStatus: "",
    employeeType: "",
    workMode: "",
  });

  const fetchEmployees = () => {
    const params = {};

    if (filters.department) params.department = filters.department;
    if (filters.employmentStatus)
      params.employmentStatus = filters.employmentStatus;
    if (filters.employeeType) params.employeeType = filters.employeeType;
    if (filters.workMode) params.workMode = filters.workMode;

    dispatch(fetchAllEmployees(params));
  };

  useEffect(() => {
    fetchEmployees();
  }, [filters, dispatch]);

  const filteredEmployees = employees.filter((emp) => {
    const name = emp.firstName || emp.name || "";
    const email = emp.email || "";
    const phone = emp.phone || emp.mobileNumber || "";

    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      phone.toLowerCase().includes(search.toLowerCase())
    );
  });

  const getInitials = (name = "NA") => {
    return name
      .split(" ")
      .map((item) => item[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Employee Details
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            View and manage all employee information.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm flex items-center gap-3">
          <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">
              Total Employees
            </p>
            <h3 className="text-xl font-bold text-slate-900">
              {employees.length}
            </h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} className="text-indigo-600" />
          <h2 className="font-semibold text-slate-800">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <select
            value={filters.department}
            onChange={(e) =>
              setFilters({ ...filters, department: e.target.value })
            }
            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none"
          >
            <option value="">All Departments</option>
            <option value="HR">HR</option>
            <option value="IT">IT</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
          </select>

          <select
            value={filters.employmentStatus}
            onChange={(e) =>
              setFilters({ ...filters, employmentStatus: e.target.value })
            }
            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Terminated">Terminated</option>
            <option value="Resigned">Resigned</option>
          </select>

          <select
            value={filters.workMode}
            onChange={(e) =>
              setFilters({ ...filters, workMode: e.target.value })
            }
            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none"
          >
            <option value="">All Work Mode</option>
            <option value="Onsite">Onsite</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <select
            value={filters.employeeType}
            onChange={(e) =>
              setFilters({ ...filters, employeeType: e.target.value })
            }
            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none"
          >
            <option value="">All Employee Type</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Intern">Intern</option>
            <option value="Contract">Contract</option>
          </select>

          <button
            onClick={() =>
              setFilters({
                department: "",
                employmentStatus: "",
                employeeType: "",
                workMode: "",
              })
            }
            className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="h-72 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-indigo-600 mb-3" size={34} />
            <p className="text-sm text-slate-500">Loading employees...</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="h-72 flex flex-col items-center justify-center text-center">
            <Users size={42} className="text-slate-300 mb-3" />
            <h3 className="font-semibold text-slate-700">No employees found</h3>
            <p className="text-sm text-slate-500 mt-1">
              Try changing your filters or search keyword.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 p-5">
            {filteredEmployees.map((employee) => {
              const job = employee.jobInformation || {};
              const payroll = employee.payroll || {};

              return (
                <div
                  key={employee._id}
                  className="border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:border-indigo-200 transition-all bg-white"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-indigo-100 flex items-center justify-center">
                        {employee.profilePhoto ? (
                          <img
                            src={employee.profilePhoto}
                            alt="profile"
                            className="w-full h-full object-center"
                          />
                        ) : (
                          <span className="text-indigo-700 font-bold">
                            {getInitials(employee.firstName || employee.firstName)}
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900">
                          {`${employee.firstName} ${employee.middleName} ${employee.lastName}` ||
                            employee.firstName ||
                            "No Name"}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {job.designation || "No Designation"}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        job.employmentStatus === "Active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {job.employmentStatus || "N/A"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <IdCard size={15} className="text-slate-400" />
                      {employee.employeeId || "Id Not Found"}
                    </p>
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <Mail size={15} className="text-slate-400" />
                      {employee.personalEmail || "No email"}
                    </p>

                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <Phone size={15} className="text-slate-400" />
                      {employee.mobileNumber || employee.phone || "No phone"}
                    </p>

                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <Building2 size={15} className="text-slate-400" />
                      {job.department || "No department"}
                    </p>

                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <Briefcase size={15} className="text-slate-400" />
                      {job.employeeType || "No employee type"} •{" "}
                      {job.workMode || "No work mode"}
                    </p>

                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <MapPin size={15} className="text-slate-400" />
                      {employee.currentAddress || "No address"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-slate-100">
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-xs text-slate-500">Joining Date</p>
                      <h4 className="text-sm font-semibold text-slate-800 mt-1">
                        {job.joiningDate
                          ? new Date(job.joiningDate).toLocaleDateString(
                              "en-IN",
                            )
                          : "N/A"}
                      </h4>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-xs text-slate-500">Salary</p>
                      <h4 className="text-sm font-semibold text-slate-800 mt-1">
                        {payroll?.salary
                          ? `₹${payroll.salary}`
                          : "N/A"}
                      </h4>
                    </div>
                  </div>

                  <button
                    // onClick={() => console.log("View employee", employee._id)}
                    onClick={() => navigate(`/admin/employeesdetails/${employee._id}`)}
                    className="w-full mt-5 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 text-sm font-semibold hover:bg-indigo-100 flex items-center justify-center gap-2"
                  >
                    <Eye size={16} />
                    View Full Details
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetails;
