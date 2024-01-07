import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

const initialState = {
  successMessage: "",
  errorMessage: "",
  loader: false,
  banners: [],
  banner: "",
};

export const add_banner = createAsyncThunk(
  "banner/add-banner",
  async (info, thunkAPI) => {
    try {
      const { data } = await api.post("/banner/add", info);
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const get_banner = createAsyncThunk(
  "banner/get-banner",
  async ({ productId }, thunkAPI) => {
    try {
      const { data } = await api.get(`/banner/get/${productId}`);
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const update_banner = createAsyncThunk(
  "banner/update-banner",
  async ({ bannerId, info }, thunkAPI) => {
    try {
      const { data } = await api.put(`/banner/update/${bannerId}`, info);
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const bannerReducer = createSlice({
  name: "banner",
  initialState,
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(add_banner.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(add_banner.fulfilled, (state, action) => {
      state.loader = false;
      state.successMessage = action.payload.message;
      state.banner = action.payload.banners;
    });
    builder.addCase(add_banner.rejected, (state, action) => {
      state.loader = false;
      state.errorMessage = action.payload.error;
    });
    builder.addCase(get_banner.fulfilled, (state, action) => {
      state.banner = action.payload.banner;
    });
    builder.addCase(update_banner.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(update_banner.fulfilled, (state, action) => {
      state.loader = false;
      state.successMessage = action.payload.message;
      state.banner = action.payload.banner;
    });
    builder.addCase(update_banner.rejected, (state, action) => {
      state.loader = false;
      state.errorMessage = action.payload.error;
    });
  },
});

export const { messageClear } = bannerReducer.actions;

export default bannerReducer.reducer;
