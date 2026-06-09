import api from "./api";

// Fetch all employees
export const fetchAllEmployeesAPI = async (params) => {
  const response = await api.get("/employee/all", { params });
  return response.data;
};

// Fetch employee by ID
export const fetchEmployeeByIdAPI = async (id) => {
  const response = await api.get(`/employee/${id}`);
  return response.data;
};

// Update an employee
export const updateEmployeeAPI = async (id, data) => {
  const response = await api.patch(`/employee/${id}`, data);
  return response.data;
};

// Register a new employee
export const registerEmployeeAPI = async (data) => {
  const response = await api.post("/employee/register", data);
  return response.data;
};
