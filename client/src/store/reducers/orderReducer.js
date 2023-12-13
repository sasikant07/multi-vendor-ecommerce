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
  async (
    { price, products, shipping_fee, shippingInfo, userId, navigate, items },
    thunkAPI
  ) => {
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
    // builder.addCase(add_to_cart.rejected, (state, action) => {
    //   state.errorMessage = action.payload.error;
    // });
  },
});

export const { messageClear } = orderReducer.actions;

export default orderReducer.reducer;
