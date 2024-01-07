import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

const initialState = {
  categories: [],
  products: [],
  totalProduct: 0,
  perPage: 4,
  latest_product: [],
  topRated_product: [],
  discount_product: [],
  priceRange: {
    low: 0,
    high: 10000,
  },
  product: {},
  relatedProducts: [],
  moreProducts: [],
  errorMessage: "",
  successMessage: "",
  totalReview: 0,
  reviews: [],
  rating_review: [],
  banners: [],
};

export const get_category = createAsyncThunk(
  "category/get-category",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/home/get-categories");
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
        `/home/query-products?category=${query.category}&&rating=${
          query.rating
        }&&lowPrice=${query.low}&&highPrice=${query.high}&&sortPrice=${
          query.sortPrice
        }&&pageNumber=${query.pageNumber}&&searchValue=${
          query.searchValue ? query.searchValue : ""
        }`
      );
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const get_product = createAsyncThunk(
  "product/get-product",
  async (slug, thunkAPI) => {
    try {
      const { data } = await api.get(`/home/get-product/${slug}`);
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const customer_review = createAsyncThunk(
  "review/customer-review",
  async (info, thunkAPI) => {
    try {
      const { data } = await api.post(`/home/customer/customer-review`, info);
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const get_reviews = createAsyncThunk(
  "review/get-reviews",
  async ({ productId, pageNumber }, thunkAPI) => {
    try {
      const { data } = await api.get(
        `/home/customer/get-reviews/${productId}?pageNo=${pageNumber}`
      );
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const get_banners = createAsyncThunk(
  "product/get-banners",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/banners");
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const homeReducer = createSlice({
  name: "home",
  initialState,
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
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
    builder.addCase(query_products.fulfilled, (state, action) => {
      state.products = action.payload.products;
      state.totalProduct = action.payload.totalProduct;
      state.perPage = action.payload.perPage;
    });
    builder.addCase(get_product.fulfilled, (state, action) => {
      state.product = action.payload.product;
      state.relatedProducts = action.payload.relatedProducts;
      state.moreProducts = action.payload.moreProducts;
    });
    builder.addCase(customer_review.fulfilled, (state, action) => {
      state.successMessage = action.payload.message;
    });
    builder.addCase(customer_review.rejected, (state, action) => {
      state.errorMessage = action.payload.error;
    });
    builder.addCase(get_reviews.fulfilled, (state, action) => {
      state.reviews = action.payload.reviews;
      state.totalReview = action.payload.totalReview;
      state.rating_review = action.payload.rating_review;
    });
    builder.addCase(get_banners.fulfilled, (state, action) => {
      state.banners = action.payload.banners;
    });
  },
});

export const { messageClear } = homeReducer.actions;

export default homeReducer.reducer;
