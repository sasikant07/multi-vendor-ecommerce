import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

const initialState = {
  cart_products: [],
  cart_products_count: 0,
  wishlist_count: 0,
  wishlist: [],
  price: 0,
  errorMessage: "",
  successMessage: "",
  shipping_fee: 0,
  out_of_stock_products: [],
};

export const add_to_cart = createAsyncThunk(
  "cart/add-to-cart",
  async (info, thunkAPI) => {
    try {
      const { data } = await api.post("/home/product/add-to-cart", info);
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const get_cart_products = createAsyncThunk(
  "cart/get-cart-products",
  async (userId, thunkAPI) => {
    try {
      const { data } = await api.get(`/home/get-cart-products/${userId}`);
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const cartReducer = createSlice({
  name: "cart",
  initialState,
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(add_to_cart.rejected, (state, action) => {
      state.errorMessage = action.payload.error;
    });
    builder.addCase(add_to_cart.fulfilled, (state, action) => {
      state.successMessage = action.payload.message;
      state.cart_products_count = state.cart_products_count + 1;
    });
  },
});

export const { messageClear } = cartReducer.actions;

export default cartReducer.reducer;
