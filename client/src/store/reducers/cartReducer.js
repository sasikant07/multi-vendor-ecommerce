import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

const initialState = {
  cart_products: [],
  cart_product_count: 0,
  wishlist_count: 0,
  wishlist: [],
  price: 0,
  errorMessage: "",
  successMessage: "",
  shipping_fee: 0,
  out_of_stock_products: [],
  buy_product_item: 0,
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
      const { data } = await api.get(
        `/home/product/get-cart-products/${userId}`
      );
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const delete_cart_product = createAsyncThunk(
  "cart/delete-cart-products",
  async (cartId, thunkAPI) => {
    try {
      const { data } = await api.delete(
        `/home/product/delete-cart-products/${cartId}`
      );
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const quantity_inc = createAsyncThunk(
  "cart/quantity-inc",
  async (cartId, thunkAPI) => {
    try {
      const { data } = await api.put(`/home/product/quantity-inc/${cartId}`);
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const quantity_dec = createAsyncThunk(
  "cart/quantity-dec",
  async (cartId, thunkAPI) => {
    try {
      const { data } = await api.put(`/home/product/quantity-dec/${cartId}`);
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const add_to_wishlist = createAsyncThunk(
  "wishlist/add-to-wishlist",
  async (info, thunkAPI) => {
    try {
      const { data } = await api.post("/home/product/add-to-wishlist", info);
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const get_wishlist_products = createAsyncThunk(
  "wishlist/get-wishlist-products",
  async (userId, thunkAPI) => {
    try {
      const { data } = await api.get(
        `/home/product/get-wishlist-products/${userId}`
      );
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const remove_wishlist_product = createAsyncThunk(
  "wishlist/remove-wishlist-product",
  async (wishlistId, thunkAPI) => {
    try {
      const { data } = await api.delete(
        `/home/product/delete-wishlist-product/${wishlistId}`
      );
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
      state.cart_product_count = state.cart_product_count + 1;
    });
    builder.addCase(get_cart_products.fulfilled, (state, action) => {
      state.cart_products = action.payload.cart_products;
      state.price = action.payload.price;
      state.cart_product_count = action.payload.cart_product_count;
      state.shipping_fee = action.payload.shippingFee;
      state.out_of_stock_products = action.payload.outOfStockProduct;
      state.buy_product_item = action.payload.buy_product_item;
    });
    builder.addCase(delete_cart_product.fulfilled, (state, action) => {
      state.successMessage = action.payload.message;
    });
    builder.addCase(delete_cart_product.rejected, (state, action) => {
      state.errorMessage = action.payload.error;
    });
    builder.addCase(quantity_inc.fulfilled, (state, action) => {
      state.successMessage = action.payload.message;
    });
    builder.addCase(quantity_inc.rejected, (state, action) => {
      state.errorMessage = action.payload.error;
    });
    builder.addCase(quantity_dec.fulfilled, (state, action) => {
      state.successMessage = action.payload.message;
    });
    builder.addCase(quantity_dec.rejected, (state, action) => {
      state.errorMessage = action.payload.error;
    });
    builder.addCase(add_to_wishlist.fulfilled, (state, action) => {
      state.successMessage = action.payload.message;
      state.wishlist_count =
        state.wishlist_count > 0 ? state.wishlist_count + 1 : 1;
    });
    builder.addCase(add_to_wishlist.rejected, (state, action) => {
      state.errorMessage = action.payload.error;
    });
    builder.addCase(get_wishlist_products.fulfilled, (state, action) => {
      state.wishlist = action.payload.wishlists;
      state.wishlist_count = action.payload.wishlistCount;
    });
    builder.addCase(remove_wishlist_product.fulfilled, (state, action) => {
      state.successMessage = action.payload.message;
      state.wishlist = state.wishlist.filter(
        (p) => p._id !== action.payload.wishlistId
      );
      state.wishlist_count = state.wishlist_count - 1;
    });
  },
});

export const { messageClear } = cartReducer.actions;

export default cartReducer.reducer;
