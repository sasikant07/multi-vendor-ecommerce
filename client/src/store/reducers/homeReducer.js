import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

const initialState = {
  categories: [],
  products: [],
  latest_product: [],
  topRated_product: [],
  discount_product: [],
  priceRange: {
    low: 0,
    high: 10000,
  },
};

export const get_category = createAsyncThunk(
  "category/get-category",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/home/get-categories");
      //   localStorage.setItem("accessToken", data.token);
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const get_products = createAsyncThunk(
  "product/get-products",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/home/get-products");
      //   localStorage.setItem("accessToken", data.token);
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const price_range_product = createAsyncThunk(
  "product/price-range-product",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/home/price-range-latest-product");
      //   localStorage.setItem("accessToken", data.token);
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const query_products = createAsyncThunk(
  "product/query-product",
  async (query, thunkAPI) => {
    try {
      const { data } = await api.get(
        `/home/query-products?category=${query.category}&&rating=${query.rating}&&lowPrice=${query.low}&&highPrice=${query.high}&&sortPrice=${query.sortPrice}&&pageNumber=${query.pageNumber}`
      );
      //   localStorage.setItem("accessToken", data.token);
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const homeReducer = createSlice({
  name: "home",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(get_category.pending, (state) => {});
    builder.addCase(get_category.fulfilled, (state, action) => {
      state.categories = action.payload.categories;
    });
    builder.addCase(get_products.fulfilled, (state, action) => {
      state.products = action.payload.products;
      state.topRated_product = action.payload.topRated_product;
      state.latest_product = action.payload.latest_product;
      state.discount_product = action.payload.discount_product;
    });
    builder.addCase(price_range_product.fulfilled, (state, action) => {
      state.latest_product = action.payload.latest_product;
      state.priceRange = action.payload.priceRange;
    });
  },
});

// export const {} = homeReducer.actions;

export default homeReducer.reducer;
