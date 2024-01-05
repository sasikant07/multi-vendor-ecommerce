import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import api from "../../api/api";

const decodeToken = (token) => {
  if (token) {
    const userInfo = jwtDecode(token);

    return userInfo;
  } else {
    return "";
  }
};

const initialState = {
  loader: false,
  userInfo: decodeToken(localStorage.getItem("customerToken")),
  errorMessage: "",
  successMessage: "",
};

export const customer_register = createAsyncThunk(
  "auth/customer-register",
  async (info, thunkAPI) => {
    try {
      const { data } = await api.post("/customer/customer-register", info);
      localStorage.setItem("customerToken", data.token);
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const customer_login = createAsyncThunk(
  "auth/customer-login",
  async (info, thunkAPI) => {
    try {
      const { data } = await api.post("/customer/customer-login", info);
      localStorage.setItem("customerToken", data.token);
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
    user_reset: (state, _) => {
      state.userInfo = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(customer_register.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(customer_register.fulfilled, (state, action) => {
      const userInfo = decodeToken(action.payload.token);
      state.loader = false;
      state.successMessage = action.payload.message;
      state.userInfo = userInfo;
    });
    builder.addCase(customer_register.rejected, (state, action) => {
      state.loader = false;
      state.errorMessage = action.payload.error;
    });
    builder.addCase(customer_login.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(customer_login.fulfilled, (state, action) => {
      const userInfo = decodeToken(action.payload.token);
      state.loader = false;
      state.successMessage = action.payload.message;
      state.userInfo = userInfo;
    });
    builder.addCase(customer_login.rejected, (state, action) => {
      state.loader = false;
      state.errorMessage = action.payload.error;
    });
  },
});

export const { messageClear, user_reset } = authReducer.actions;

export default authReducer.reducer;
