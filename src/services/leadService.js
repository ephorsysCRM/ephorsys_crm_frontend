import api from "./api";

// Create a lead
export const createLeadAPI = async (data) => {
  const response = await api.post("/lead/create-lead", data);
  return response.data;
};

// Get all leads
export const fetchLeadsAPI = async (params) => {
  const response = await api.get("/lead/get-leads", { params });
  return response.data;
};

// Get lead by ID
export const fetchLeadByIdAPI = async (id) => {
  const response = await api.get(`/lead/get-lead/${id}`);
  return response.data;
};

// Update call status
export const updateLeadCallStatusAPI = async (id, data) => {
  const response = await api.patch(`/lead/${id}/update-lead`, data);
  return response.data;
};

// Schedule meeting
export const scheduleMeetingAPI = async (id, data) => {
  const response = await api.post(`/lead/${id}/meeting`, data);
  return response.data;
};

// Close lead
export const closeLeadAPI = async (id, data) => {
  const response = await api.patch(`/lead/${id}/close`, data);
  return response.data;
};

// Get dashboard stats
export const fetchDashboardStatsAPI = async () => {
  const response = await api.get("/lead/dashboard");
  return response.data;
};

// Get hotlist (leads due for follow-up)
export const fetchHotlistAPI = async () => {
  const response = await api.get("/lead/hotlist");
  return response.data;
};

// Get pipeline (leads grouped by status)
export const fetchPipelineAPI = async () => {
  const response = await api.get("/lead/pipeline");
  return response.data;
};

// Get employee performance
export const fetchEmployeePerformanceAPI = async (employeeId) => {
  const response = await api.get(`/lead/performance/${employeeId}`);
  return response.data;
};

