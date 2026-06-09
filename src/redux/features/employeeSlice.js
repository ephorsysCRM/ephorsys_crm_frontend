import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as employeeService from "../../services/employeeService";

// Async Thunks
export const fetchAllEmployees = createAsyncThunk(
  "employee/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const data = await employeeService.fetchAllEmployeesAPI(params);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch employees" }
      );
    }
  }
);

export const fetchEmployeeById = createAsyncThunk(
  "employee/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await employeeService.fetchEmployeeByIdAPI(id);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch employee" }
      );
    }
  }
);

export const registerEmployee = createAsyncThunk(
  "employee/register",
  async (employeeData, { rejectWithValue }) => {
    try {
      const data = await employeeService.registerEmployeeAPI(employeeData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to register employee" }
      );
    }
  }
);

export const updateEmployee = createAsyncThunk(
  "employee/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const responseData = await employeeService.updateEmployeeAPI(id, data);
      return responseData;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update employee" }
      );
    }
  }
);

const initialState = {
  employees: [],
  currentEmployee: null,
  loading: false,
  error: null,
  successMessage: null,
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    clearEmployeeMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    clearCurrentEmployee: (state) => {
      state.currentEmployee = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Employees
      .addCase(fetchAllEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.data || action.payload; // Adjust based on API structure
      })
      .addCase(fetchAllEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Error fetching employees";
      })

      // Fetch Employee By ID
      .addCase(fetchEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEmployee = action.payload.data || action.payload;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Error fetching employee";
      })

      // Register Employee
      .addCase(registerEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(registerEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Employee registered successfully!";
        // Optionally append to the employees array
        if (action.payload?.data) {
          state.employees.push(action.payload.data);
        }
      })
      .addCase(registerEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Error registering employee";
      })

      // Update Employee
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateEmployee.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Employee updated successfully!";
        // Backend does not return the updated employee object,
        // so we rely on components to refetch or optimistically update
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Error updating employee";
      });
  },
});

export const { clearEmployeeMessages, clearCurrentEmployee } = employeeSlice.actions;

export default employeeSlice.reducer;
