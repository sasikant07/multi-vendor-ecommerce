import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

const initialState = {
  errorMessage: "",
  successMessage: "",
  loader: false,
  pendingWithdraws: [],
  successWithDraws: [],
  totalAmount: 0,
  withdrawnAmount: 0,
  pendingAmount: 0,
  availableAmount: 0,
};

export const get_admin_payment_details = createAsyncThunk(
  "payment/get-seller-payment-details",
  async (sellerId, thunkAPI) => {
    try {
      const { data } = await api.get(
        `/payment/seller-payment-details/${sellerId}`
      );
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const send_withdrawl_request = createAsyncThunk(
  "payment/send-widthdrawl-request",
  async (info, thunkAPI) => {
    try {
      const { data } = await api.post(`/payment/widthdrawl-request`, info);
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const get_payment_request = createAsyncThunk(
  "payment/get-payment-request",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get(`/payment/get-payment-request`);
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const confirm_payment_request = createAsyncThunk(
  "payment/confirm-payment-request",
  async (paymentId, thunkAPI) => {
    try {
      const { data } = await api.post(
        `/payment/confirm-payment-request`,
        { paymentId }, { withCredentials: true }
      );
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const paymentReducer = createSlice({
  name: "payment",
  initialState,
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(get_admin_payment_details.fulfilled, (state, action) => {
      state.pendingWithdraws = action.payload.pendingWithdraws;
      state.successWithDraws = action.payload.successWithdraws;
      state.totalAmount = action.payload.totalAmount;
      state.availableAmount = action.payload.availableAmount;
      state.withdrawnAmount = action.payload.withdrawnAmount;
      state.pendingAmount = action.payload.pendingAmount;
    });
    builder.addCase(send_withdrawl_request.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(send_withdrawl_request.fulfilled, (state, action) => {
      state.loader = false;
      state.successMessage = action.payload.message;
      state.pendingWithdraws = [
        ...state.pendingWithdraws,
        action.payload.withdrawl,
      ];
      state.availableAmount =
        state.availableAmount - action.payload.withdrawl.amount;
      state.pendingAmount = action.payload.withdrawl.amount;
    });
    builder.addCase(send_withdrawl_request.rejected, (state, action) => {
      state.loader = false;
      state.errorMessage = action.payload.error;
    });
    builder.addCase(get_payment_request.fulfilled, (state, action) => {
      state.pendingWithdraws = action.payload.withdrawlRequest;
    });
    builder.addCase(confirm_payment_request.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(confirm_payment_request.fulfilled, (state, action) => {
      const temp = state.pendingWithdraws.filter(
        (r) => r._id !== action.payload.payment._id
      );
      state.loader = false;
      state.successMessage = action.payload.message;
      state.pendingWithdraws = temp;
    });
    builder.addCase(confirm_payment_request.rejected, (state, action) => {
      state.loader = false;
      state.errorMessage = action.payload.error;
    });
  },
});

export const { messageClear } = paymentReducer.actions;

export default paymentReducer.reducer;
