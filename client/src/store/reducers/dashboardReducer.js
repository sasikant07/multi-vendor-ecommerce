import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

const initialState = {
  recentOrders: [],
  errorMessage: "",
  successMessage: "",
  totalOrder: 0,
  pendingOrder: 0,
  cancelledOrder: 0,
};

export const get_dashboard_index_data = createAsyncThunk(
  "dashboard/get-dashboard-index-data",
  async (userId, thunkAPI) => {
    try {
      const { data } = await api.get(`/customer/get-dashboard-data/${userId}`);
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const dashboardReducer = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
    extraReducers: (builder) => {
      builder.addCase(get_dashboard_index_data.fulfilled, (state, action) => {
        state.totalOrder = action.payload.totalOrder;
        state.pendingOrder = action.payload.pendingOrder;
        state.cancelledOrder = action.payload.cancelledOrder;
        state.recentOrders = action.payload.recentOrders;
      });
    },
  },
});

export const { messageClear } = dashboardReducer.actions;

export default dashboardReducer.reducer;
