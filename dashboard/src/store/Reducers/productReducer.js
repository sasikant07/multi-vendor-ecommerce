import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

const initialState = {
  successMessage: "",
  errorMessage: "",
  loader: false,
  products: [],
  totalProduct: 0,
};

export const add_product = createAsyncThunk(
  "product/addProduct",
  async (productData, thunkAPI) => {
    try {
      const { data } = await api.post("/product-add", productData, {
        withCredentials: true,
      });
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const get_product = createAsyncThunk(
  "product/get_product",
  async ({ perPage, page, searchValue }, thunkAPI) => {
    try {
      const { data } = await api.get(
        `/category-get?page=${page}&&searchValue=${searchValue}&&perPage=${perPage}`,
        {
          withCredentials: true,
        }
      );
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const productReducer = createSlice({
  name: "product",
  initialState,
  reducers: {
    messageClear: (state, action) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(add_product.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(add_product.fulfilled, (state, action) => {
      state.loader = false;
      state.successMessage = action.payload.message;
      state.products = [...state.products, action.payload.products];
    });
    builder.addCase(add_product.rejected, (state, action) => {
      state.loader = false;
      state.errorMessage = action.payload.error;
    });
    builder.addCase(get_product.fulfilled, (state, action) => {
      state.totalProduct = action.payload.totalProduct;
      state.products = action.payload.products;
    });
  },
});

export const { messageClear } = productReducer.actions;

export default productReducer.reducer;
