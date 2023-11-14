import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import jwt from "jwt-decode";
import api from "../../api/api";

const returnRole = (token) => {
  if (token) {
    const decodeToken = jwt(token);
    const expireTime = new Date(decodeToken.exp * 1000);
    if (new Date() > expireTime) {
      localStorage.removeItem("accessToken");
      return "";
    } else {
      return decodeToken.role;
    }
  } else {
    return "";
  }
};

const initialState = {
  successMessage: "",
  errorMessage: "",
  loader: false,
  userInfo: "",
  role: returnRole(localStorage.getItem("accessToken")),
  token: localStorage.getItem("accessToken"),
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

export const get_user_info = createAsyncThunk(
  "auth/get_user_info",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/get-user", {
        withCredentials: true,
      });
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

export const seller_profile_image_upload = createAsyncThunk(
  "auth/seller_profile_image_upload",
  async (image, thunkAPI) => {
    try {
      const { data } = await api.post("/seller-profile-image-upload", image, {
        withCredentials: true,
      });
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
      state.token = action.payload.token;
      state.role = returnRole(action.payload.token);
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
      state.token = action.payload.token;
      state.role = returnRole(action.payload.token);
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
      state.token = action.payload.token;
      state.role = returnRole(action.payload.token);
    });
    builder.addCase(seller_login.rejected, (state, action) => {
      state.loader = false;
      state.errorMessage = action.payload.error;
    });
    builder.addCase(get_user_info.fulfilled, (state, action) => {
      state.loader = false;
      state.userInfo = action.payload.userInfo;
      state.role = action.payload.userInfo.role;
    });
    builder.addCase(seller_profile_image_upload.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(seller_profile_image_upload.fulfilled, (state, action) => {
      state.loader = false;
      state.successMessage = action.payload.message;
      state.userInfo = action.payload.userInfo;
    });
  },
});

export const { messageClear } = authReducer.actions;

export default authReducer.reducer;
