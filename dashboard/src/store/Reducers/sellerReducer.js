import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

const initialState = {
  successMessage: "",
  errorMessage: "",
  loader: false,
  sellers: [],
  totalSellers: 0,
  seller: "",
};

export const get_seller_request = createAsyncThunk(
  "seller/get_seller_request",
  async ({ perPage, page, searchValue }, thunkAPI) => {
    try {
      const { data } = await api.get(
        `/request-seller-get?page=${page}&&searchValue=${searchValue}&&perPage=${perPage}`
      );
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const get_seller = createAsyncThunk(
  "seller/get_seller",
  async (sellerId, thunkAPI) => {
    try {
      const { data } = await api.get(`/get-seller/${sellerId}`);
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const seller_status_update = createAsyncThunk(
  "seller/seller_status_update",
  async (info, thunkAPI) => {
    try {
      const { data } = await api.post(`/seller-status-update`, info);
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const get_active_sellers = createAsyncThunk(
  "seller/get-active-sellers",
  async ({ perPage, page, searchValue }, thunkAPI) => {
    try {
      const { data } = await api.get(
        `/get-sellers?page=${page}&&searchValue=${searchValue}&&perPage=${perPage}`
      );
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const get_deactive_sellers = createAsyncThunk(
  "seller/get-deactive-sellers",
  async ({ perPage, page, searchValue }, thunkAPI) => {
    try {
      const { data } = await api.get(
        `/get-deactive-sellers?page=${page}&&searchValue=${searchValue}&&perPage=${perPage}`
      );
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const create_stripe_connect_account = createAsyncThunk(
  "seller/create-stripe-connect-account",
  async (thunkAPI) => {
    try {
      const { data } = await api.get(`/payment/create-stripe-connect-account`);
      window.location.href = data.url;
      // return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const active_stripe_connect_account = createAsyncThunk(
  "seller/active-stripe-connect-account",
  async (activeCode, thunkAPI) => {
    try {
      const { data } = await api.put(
        `/payment/active-stripe-connect-account/${activeCode}`,
        {}
      );
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
    builder.addCase(get_active_sellers.fulfilled, (state, action) => {
      state.sellers = action.payload.sellers;
      state.totalSellers = action.payload.totalSellers;
    });
    builder.addCase(get_deactive_sellers.fulfilled, (state, action) => {
      state.sellers = action.payload.sellers;
      state.totalSellers = action.payload.totalSellers;
    });
    builder.addCase(active_stripe_connect_account.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(
      active_stripe_connect_account.fulfilled,
      (state, action) => {
        state.loader = false;
        state.successMessage = action.payload.message;
      }
    );
    builder.addCase(active_stripe_connect_account.rejected, (state, action) => {
      state.loader = false;
      state.errorMessage = action.payload.message;
    });
  },
});

export const { messageClear } = sellerReducer.actions;

export default sellerReducer.reducer;
