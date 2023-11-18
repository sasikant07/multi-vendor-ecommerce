import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

const initialState = {
  successMessage: "",
  errorMessage: "",
  loader: false,
  sellers: [],
  totalSeller: 0,
  seller: "",
};

export const get_seller_request = createAsyncThunk(
  "category/get_seller_request",
  async ({ perPage, page, searchValue }, thunkAPI) => {
    try {
      const { data } = await api.get(
        `/request-seller-get?page=${page}&&searchValue=${searchValue}&&perPage=${perPage}`,
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

export const get_seller = createAsyncThunk(
  "category/get_seller",
  async (sellerId, thunkAPI) => {
    try {
      const { data } = await api.get(`/get-seller/${sellerId}`, {
        withCredentials: true,
      });
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const seller_status_update = createAsyncThunk(
  "category/seller_status_update",
  async (info, thunkAPI) => {
    try {
      const { data } = await api.post(`/seller-status-update`, info, {
        withCredentials: true,
      });
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const sellerReducer = createSlice({
  name: "seller",
  initialState,
  reducers: {
    messageClear: (state, action) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(get_seller_request.fulfilled, (state, action) => {
      state.totalSeller = action.payload.totalSeller;
      state.sellers = action.payload.sellers;
    });
    builder.addCase(get_seller.fulfilled, (state, action) => {
      state.seller = action.payload.seller;
    });
    builder.addCase(seller_status_update.fulfilled, (state, action) => {
      state.seller = action.payload.seller;
      state.successMessage = action.payload.message;
    });
  },
});

export const { messageClear } = sellerReducer.actions;

export default sellerReducer.reducer;
