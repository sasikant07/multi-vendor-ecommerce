import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

const initialState = {
  totalSale: 0,
  totalOrder: 0,
  totalProduct: 0,
  totalPendingOrder: 0,
  totalSeller: 0,
  recentOrders: [],
  recentMessage: [],
};

export const get_seller_dashboard_index_data = createAsyncThunk(
  "dashboardIndex/get-seller-dashboard-index-data",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/seller/get-dashboard-index-data");
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const get_admin_dashboard_index_data = createAsyncThunk(
  "dashboardIndex/get-admin-dashboard-index-data",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/admin/get-dashboard-index-data");
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const dashboardIndexReducer = createSlice({
  name: "dashboardIndex",
  initialState,
  reducers: {
    // messageClear: (state, action) => {
    //   state.errorMessage = "";
    //   state.successMessage = "";
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(
      get_seller_dashboard_index_data.fulfilled,
      (state, action) => {
        state.totalSale = action.payload.totalSale;
        state.totalOrder = action.payload.totalOrders;
        state.totalPendingOrder = action.payload.totalPendingOrder;
        state.recentOrders = action.payload.recentOrders;
        state.recentMessage = action.payload.recentMessages;
        state.totalProduct = action.payload.totalProduct;
      }
    );
    builder.addCase(
      get_admin_dashboard_index_data.fulfilled,
      (state, action) => {
        state.totalSale = action.payload.totalSale;
        state.totalOrder = action.payload.totalOrders;
        state.totalSeller = action.payload.totalSeller;
        state.recentOrders = action.payload.recentOrders;
        state.recentMessage = action.payload.recentMessages;
        state.totalProduct = action.payload.totalProduct;
      }
    );
  },
});

// export const { messageClear } = dashboardIndexReducer.actions;

export default dashboardIndexReducer.reducer;
