import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

const initialState = {
  successMessage: "",
  errorMessage: "",
  loader: false,
  banners: [],
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
  },
});

export const { messageClear } = bannerReducer.actions;

export default bannerReducer.reducer;
