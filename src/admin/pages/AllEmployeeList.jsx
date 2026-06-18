import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Plus, Loader2, Pencil } from "lucide-react";
import { fetchAllEmployees } from "../../redux/features/employeeSlice";


const AllEmployeeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { employees, loading, error } = useSelector(
    (state) => state.employee
  );

  useEffect(() => {
    dispatch(fetchAllEmployees());
  }, [dispatch]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Employee List
            </h1>
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

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
            {error}
          </div>
        )}

        {/* Table */}
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
                  {employees?.length > 0 ? (
                    employees.map((employee, index) => {
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
                            <div className="flex items-center gap-3">

                              <div>
                                <p className="font-medium text-slate-800">
                                  {fullName}
                                </p>

                                <p className="text-xs text-slate-500">
                                  {employee?.employeeId}
                                </p>
                              </div>
                            </div>
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
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${employee?.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                                }`}
                            >
                              {employee?.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() =>
                                navigate(
                                  `/employees/edit/${employee._id}`
                                )
                              }
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-100 hover:text-blue-600"
                            >
                              <Pencil size={18} />
                            </button>
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