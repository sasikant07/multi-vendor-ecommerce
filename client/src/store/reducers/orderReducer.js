import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

const initialState = {
  myOrders: [],
  errorMessage: "",
  successMessage: "",
  myOrder: {},
};

export const place_order = createAsyncThunk(
  "order/place-order",
  async ({
    price,
    products,
    shipping_fee,
    shippingInfo,
    userId,
    navigate,
    items,
  }) => {
    try {
      const { data } = await api.post(`/home/order/place-order`, {
        price,
        products,
        shipping_fee,
        shippingInfo,
        userId,
        navigate,
        items,
      });
      navigate("/payment", {
        state: {
          price: price + shipping_fee,
          items,
          orderId: data.orderId,
        },
      });
      return true;
    } catch (error) {
      return error.response;
    }
  }
);

export const get_orders = createAsyncThunk(
  "order/get-orders",
  async ({ customerId, status }, thunkAPI) => {
    try {
      const { data } = await api.get(
        `/home/customer/get-orders/${customerId}/${status}`
      );
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const get_order = createAsyncThunk(
  "order/get-order",
  async (orderId, thunkAPI) => {
    try {
      const { data } = await api.get(`/home/customer/get-order/${orderId}`);
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
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(get_orders.fulfilled, (state, action) => {
      state.myOrders = action.payload.orders;
    });
    builder.addCase(get_order.fulfilled, (state, action) => {
      state.myOrder = action.payload.order;
    });
  },
});

export const { messageClear } = orderReducer.actions;

export default orderReducer.reducer;
