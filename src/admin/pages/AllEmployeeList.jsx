import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Loader2,
  Pencil,
  Filter,
  Search,
  MoreVertical,
} from "lucide-react";
import { fetchAllEmployees } from "../../redux/features/employeeSlice";

const AllEmployeeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);

  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    department: "",
    employmentStatus: "",
    employeeType: "",
    workMode: "",
  });

  const { employees, loading, error } = useSelector((state) => state.employee);

  useEffect(() => {
    dispatch(fetchAllEmployees());
  }, [dispatch]);

  const filteredEmployees = employees?.filter((employee) => {
    const fullName = [
      employee?.firstName,
      employee?.middleName,
      employee?.lastName,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const email = (
      employee?.officialEmail ||
      employee?.personalEmail ||
      ""
    ).toLowerCase();

    const phone = employee?.mobileNumber || "";
    const searchText = search.toLowerCase();

    const matchesSearch =
      fullName.includes(searchText) ||
      email.includes(searchText) ||
      phone.includes(searchText);

    const matchesDepartment =
      !filters.department ||
      employee?.jobInformation?.department === filters.department;

    const matchesStatus =
      !filters.employmentStatus ||
      (filters.employmentStatus === "Active" && employee?.isActive) ||
      (filters.employmentStatus === "Inactive" && !employee?.isActive);

    const matchesEmployeeType =
      !filters.employeeType ||
      employee?.jobInformation?.employeeType === filters.employeeType;

    const matchesWorkMode =
      !filters.workMode ||
      employee?.jobInformation?.workMode === filters.workMode;

    return (
      matchesSearch &&
      matchesDepartment &&
      matchesStatus &&
      matchesEmployeeType &&
      matchesWorkMode
    );
  });

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Employee List</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage all employees from one place.
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/register")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:bg-green-700 cursor-pointer"
          >
            <Plus size={18} />
            Add Employee
          </button>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={16} className="text-indigo-600" />
            <h2 className="font-medium text-sm text-slate-800">Filters</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-6 gap-2">
            <div className="lg:col-span-2 relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search employee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <select
              value={filters.department}
              onChange={(e) =>
                setFilters({ ...filters, department: e.target.value })
              }
              className="px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Department</option>
              <option value="HR">HR</option>
              <option value="IT">IT</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
            </select>

            <select
              value={filters.employmentStatus}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  employmentStatus: e.target.value,
                })
              }
              className="px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <select
              value={filters.workMode}
              onChange={(e) =>
                setFilters({ ...filters, workMode: e.target.value })
              }
              className="px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Work Mode</option>
              <option value="Onsite">Onsite</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>

            <select
              value={filters.employeeType}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  employeeType: e.target.value,
                })
              }
              className="px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Employee Type</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Intern">Intern</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          <div className="flex justify-end mt-3">
            <button
              onClick={() => {
                setSearch("");
                setFilters({
                  department: "",
                  employmentStatus: "",
                  employeeType: "",
                  workMode: "",
                });
              }}
              className="px-3 py-2 rounded-lg bg-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Employee
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Mobile
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Designation
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Department
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredEmployees?.length > 0 ? (
                    filteredEmployees.map((employee, index) => {
                      const fullName = [
                        employee?.firstName,
                        employee?.middleName,
                        employee?.lastName,
                      ]
                        .filter(Boolean)
                        .join(" ");

                      return (
                        <tr
                          key={employee._id}
                          className="transition duration-150 hover:bg-slate-50"
                        >
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {index + 1}
                          </td>

                          <td className="px-6 py-4">
                            <p className="font-medium text-slate-800">
                              {fullName}
                            </p>
                            <p className="text-xs text-slate-500">
                              {employee?.employeeId}
                            </p>
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {employee?.officialEmail ||
                              employee?.personalEmail ||
                              "N/A"}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {employee?.mobileNumber || "N/A"}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {employee?.jobInformation?.designation || "N/A"}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {employee?.jobInformation?.department || "N/A"}
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                employee?.isActive
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {employee?.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-center">
                            <div className="relative inline-block">
                              <button
                                onClick={() =>
                                  setOpenMenu(
                                    openMenu === employee._id
                                      ? null
                                      : employee._id,
                                  )
                                }
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                              >
                               <MoreVertical size={18} />
                              </button>

                              {openMenu === employee._id && (
                                <div className="absolute right-0 bottom-10 z-50 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                                  <button
                                    onClick={() => {
                                      navigate(
                                        `/admin/employeesdetails/${employee._id}`,
                                      );
                                      setOpenMenu(null);
                                    }}
                                    className="flex w-full items-center gap-2 px-4 py-3 text-sm text-slate-700 transition hover:bg-blue-50 hover:text-green-600"
                                  >
                                    👁️ View Details
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-12 text-center text-slate-500"
                      >
                        No employees found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllEmployeeList;
