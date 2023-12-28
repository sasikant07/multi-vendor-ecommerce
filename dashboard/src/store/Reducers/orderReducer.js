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
  },
});

export const { messageClear } = orderReducer.actions;

export default orderReducer.reducer;
