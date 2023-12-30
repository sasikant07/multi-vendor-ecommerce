import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

const initialState = {
  successMessage: "",
  errorMessage: "",
  totalOrder: 0,
  order: {},
  myOrders: [],
};

export const get_admin_orders = createAsyncThunk(
  "order/get-admin-orders",
  async ({ perPage, page, searchValue }, thunkAPI) => {
    try {
      const { data } = await api.get(
        `/admin/orders?page=${page}&searchValue=${searchValue}&perPage=${perPage}`
      );
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const get_admin_order = createAsyncThunk(
  "order/get-admin-order",
  async (orderId, thunkAPI) => {
    try {
      const { data } = await api.get(`/admin/order/${orderId}`);
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const admin_order_status_update = createAsyncThunk(
  "order/admin-order-status-update",
  async ({ orderId, info }, thunkAPI) => {
    try {
      const { data } = await api.put(
        `/admin/order-status/update/${orderId}`,
        info
      );
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const get_seller_orders = createAsyncThunk(
  "order/get-seller-orders",
  async ({ perPage, page, searchValue, sellerId }, thunkAPI) => {
    try {
      const { data } = await api.get(
        `/seller/orders/${sellerId}?page=${page}&searchValue=${searchValue}&perPage=${perPage}`
      );
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const get_seller_order = createAsyncThunk(
  "order/get-seller-order",
  async (orderId, thunkAPI) => {
    try {
      const { data } = await api.get(`/seller/order/${orderId}`);
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const seller_order_status_update = createAsyncThunk(
  "order/seller-order-status-update",
  async ({ orderId, info }, thunkAPI) => {
    try {
      const { data } = await api.put(
        `/seller/order-status/update/${orderId}`,
        info
      );
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const orderReducer = createSlice({
  name: "order",
  initialState,
  reducers: {
    messageClear: (state, action) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(get_admin_orders.fulfilled, (state, action) => {
      state.myOrders = action.payload.orders;
      state.totalOrder = action.payload.totalOrder;
    });
    builder.addCase(get_admin_order.fulfilled, (state, action) => {
      state.order = action.payload.order;
    });
    builder.addCase(admin_order_status_update.fulfilled, (state, action) => {
      state.successMessage = action.payload.message;
    });
    builder.addCase(admin_order_status_update.rejected, (state, action) => {
      state.errorMessage = action.payload.error;
    });
    builder.addCase(get_seller_orders.fulfilled, (state, action) => {
      state.myOrders = action.payload.orders;
      state.totalOrder = action.payload.totalOrder;
    });
    builder.addCase(get_seller_order.fulfilled, (state, action) => {
      state.order = action.payload.order;
    });
    builder.addCase(seller_order_status_update.fulfilled, (state, action) => {
      state.successMessage = action.payload.message;
    });
    builder.addCase(seller_order_status_update.rejected, (state, action) => {
      state.errorMessage = action.payload.error;
    });
  },
});

export const { messageClear } = orderReducer.actions;

export default orderReducer.reducer;
