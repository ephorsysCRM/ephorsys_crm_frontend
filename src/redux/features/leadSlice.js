import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as leadService from "../../services/leadService";

export const fetchLeads = createAsyncThunk(
  "lead/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const data = await leadService.fetchLeadsAPI(params);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch leads" }
      );
    }
  }
);

export const fetchLeadById = createAsyncThunk(
  "lead/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await leadService.fetchLeadByIdAPI(id);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch lead" }
      );
    }
  }
);

export const createLead = createAsyncThunk(
  "lead/create",
  async (leadData, { rejectWithValue }) => {
    try {
      const data = await leadService.createLeadAPI(leadData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to create lead" }
      );
    }
  }
);

export const updateLeadCallStatus = createAsyncThunk(
  "lead/updateCallStatus",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const responseData = await leadService.updateLeadCallStatusAPI(id, data);
      return responseData;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update call status" }
      );
    }
  }
);

export const scheduleMeeting = createAsyncThunk(
  "lead/scheduleMeeting",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const responseData = await leadService.scheduleMeetingAPI(id, data);
      return responseData;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to schedule meeting" }
      );
    }
  }
);

export const closeLead = createAsyncThunk(
  "lead/close",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const responseData = await leadService.closeLeadAPI(id, data);
      return responseData;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to close lead" }
      );
    }
  }
);

const initialState = {
  leads: [],
  currentLead: null,
  loading: false,
  error: null,
  successMessage: null,
  pagination: null,
};

const leadSlice = createSlice({
  name: "lead",
  initialState,
  reducers: {
    clearLeadMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    clearCurrentLead: (state) => {
      state.currentLead = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Leads
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        // API returns: { success, total, page, pages, data: [...] }
        state.leads = action.payload.data || [];
        state.pagination = action.payload.pages
          ? {
              total: action.payload.total,
              page: action.payload.page,
              pages: action.payload.pages,
            }
          : null;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Error fetching leads";
      })

      // Fetch Lead By Id
      .addCase(fetchLeadById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeadById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLead = action.payload.data || action.payload;
      })
      .addCase(fetchLeadById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Error fetching lead";
      })

      // Create Lead
      .addCase(createLead.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createLead.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Lead created successfully!";
        if (action.payload?.data) {
          state.leads.unshift(action.payload.data); // Add new lead to the beginning
        }
      })
      .addCase(createLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Error creating lead";
      })

      // Update Call Status
      .addCase(updateLeadCallStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateLeadCallStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Lead call status updated successfully!";
        const updatedLead = action.payload.data || action.payload;
        const index = state.leads.findIndex((l) => l._id === updatedLead._id);
        if (index !== -1) {
          state.leads[index] = { ...state.leads[index], ...updatedLead };
        }
        if (state.currentLead?._id === updatedLead._id) {
          state.currentLead = { ...state.currentLead, ...updatedLead };
        }
      })
      .addCase(updateLeadCallStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Error updating lead call status";
      })
      
      // Schedule Meeting
      .addCase(scheduleMeeting.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(scheduleMeeting.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Meeting scheduled successfully!";
      })
      .addCase(scheduleMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Error scheduling meeting";
      })

      // Close Lead
      .addCase(closeLead.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(closeLead.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Lead closed successfully!";
        const updatedLead = action.payload.data || action.payload;
        const index = state.leads.findIndex((l) => l._id === updatedLead._id);
        if (index !== -1) {
          state.leads[index] = { ...state.leads[index], ...updatedLead };
        }
      })
      .addCase(closeLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Error closing lead";
      });
  },
});

export const { clearLeadMessages, clearCurrentLead } = leadSlice.actions;

export default leadSlice.reducer;
