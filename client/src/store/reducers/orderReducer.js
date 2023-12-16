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
    { price, products, shipping_fee, shippingInfo, userId, navigate, items }
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
      navigate("/payment", {
        state: {
          price: price + shipping_fee,
          items,
          orderId: data.orderId,
        }
      })
      return true;
    } catch (error) {
      return error.response;
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