import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

const initialState = {
  successMessage: "",
  errorMessage: "",
  customers: [],
  messages: [],
  activeCustomer: [],
  activeSeller: [],
  messageNotification: [],
  activeAdmin: "",
  friends: [],
  seller_admin_message: [],
  currentSeller: {},
  currentCustomer: {},
};

export const get_customers = createAsyncThunk(
  "chat/get-customers",
  async (sellerId, thunkAPI) => {
    try {
      const { data } = await api.get(`/chat/seller/get-customers/${sellerId}`);
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const get_customer_seller_message = createAsyncThunk(
  "chat/get-customer-message",
  async (customerId, thunkAPI) => {
    try {
      const { data } = await api.get(
        `/chat/seller/get-customer-seller-message/${customerId}`
      );
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const send_message = createAsyncThunk(
  "chat/send-message",
  async (info, thunkAPI) => {
    try {
      const { data } = await api.post(
        `/chat/seller/send-message-to-customer`,
        info
      );
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const chatReducer = createSlice({
  name: "chat",
  initialState,
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(get_customers.fulfilled, (state, action) => {
      state.customers = action.payload.customers;
    });
    builder.addCase(get_customer_seller_message.fulfilled, (state, action) => {
      state.messages = action.payload.messages;
      state.currentCustomer = action.payload.currentcustomer;
    });
    builder.addCase(send_message.fulfilled, (state, action) => {
      let tempFriends = state.customers;
      let index = tempFriends.findIndex(
        (f) => f.fdId === action.payload.message.receiverId
      );

      while (index > 0) {
        let temp = tempFriends[index];
        tempFriends[index] = tempFriends[index - 1];
        tempFriends[index - 1] = temp;

        index--;
      }
      state.customers = tempFriends;
      state.messages = [...state.messages, action.payload.message];
      state.successMessage = "Message sent";
    });
  },
});

export const { messageClear } = chatReducer.actions;

export default chatReducer.reducer;
