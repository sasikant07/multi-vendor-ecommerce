import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

const initialState = {
  successMessage: "",
  errorMessage: "",
  loader: false,
  products: [],
  product: "",
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

export const update_product = createAsyncThunk(
  "product/updateProduct",
  async (productData, thunkAPI) => {
    try {
      const { data } = await api.post("/product-update", productData, {
        withCredentials: true,
      });
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const product_image_update = createAsyncThunk(
  "product/updateProductImage",
  async ({oldImage, newImage, productId}, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("oldImage", oldImage);
      formData.append("newImage", newImage);
      formData.append("productId", productId);
      const { data } = await api.post("/product-image-update", formData, {
        withCredentials: true,
      });
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const get_products = createAsyncThunk(
  "product/get_products",
  async ({ perPage, page, searchValue }, thunkAPI) => {
    try {
      const { data } = await api.get(
        `/products-get?page=${page}&&searchValue=${searchValue}&&perPage=${perPage}`,
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

export const get_product = createAsyncThunk(
  "product/get_product",
  async (productId, thunkAPI) => {
    try {
      const { data } = await api.get(`/product-get/${productId}`, {
        withCredentials: true,
      });
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
    builder.addCase(get_products.fulfilled, (state, action) => {
      state.totalProduct = action.payload.totalProduct;
      state.products = action.payload.products;
    });
    builder.addCase(get_product.fulfilled, (state, action) => {
      state.product = action.payload.product;
    });
    builder.addCase(update_product.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(update_product.fulfilled, (state, action) => {
      state.loader = false;
      state.successMessage = action.payload.message;
      state.product = action.payload.product;
    });
    builder.addCase(update_product.rejected, (state, action) => {
      state.loader = false;
      state.errorMessage = action.payload.error;
    });
    builder.addCase(product_image_update.fulfilled, (state, action) => {
      state.product = action.payload.product;
      state.successMessage = action.payload.message;
    });
  },
});

export const { messageClear } = productReducer.actions;

export default productReducer.reducer;
