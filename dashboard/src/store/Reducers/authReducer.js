import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

const initialState = {
  successMessage: "",
  errorMessage: "",
  loader: false,
  userInfo: "",
};

export const admin_login = createAsyncThunk(
  "auth/admin_login",
  async (info, thunkAPI) => {
    try {
      const { data } = await api.post("/admin-login", info, {
        withCredentials: true,
      });
      localStorage.setItem("accessToken", data.token);
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const seller_register = createAsyncThunk(
  "auth/seller_register",
  async (info, thunkAPI) => {
    try {
      const { data } = await api.post("/seller-register", info, {
        withCredentials: true,
      });
      localStorage.setItem("accessToken", data.token);
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const seller_login = createAsyncThunk(
  "auth/seller_login",
  async (info, thunkAPI) => {
    try {
      const { data } = await api.post("/seller-login", info, {
        withCredentials: true,
      });
      localStorage.setItem("accessToken", data.token);
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    messageClear: (state, action) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(admin_login.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(admin_login.fulfilled, (state, action) => {
      state.loader = false;
      state.successMessage = action.payload.message;
    });
    builder.addCase(admin_login.rejected, (state, action) => {
      state.loader = false;
      state.errorMessage = action.payload.error;
    });
    builder.addCase(seller_register.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(seller_register.fulfilled, (state, action) => {
      state.loader = false;
      state.successMessage = action.payload.message;
    });
    builder.addCase(seller_register.rejected, (state, action) => {
      state.loader = false;
      state.errorMessage = action.payload.error;
    });
    builder.addCase(seller_login.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(seller_login.fulfilled, (state, action) => {
      state.loader = false;
      state.successMessage = action.payload.message;
    });
    builder.addCase(seller_login.rejected, (state, action) => {
      state.loader = false;
      state.errorMessage = action.payload.error;
    });
  },
});

export const { messageClear } = authReducer.actions;

export default authReducer.reducer;
