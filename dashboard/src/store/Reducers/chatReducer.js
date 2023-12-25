import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

const initialState = {
  successMessage: "",
  errorMessage: "",
  customers: [],
  messages: [],
  activeCustomer: [],
  activeSellers: [],
  messageNotification: [],
  activeAdmin: "",
  friends: [],
  seller_admin_message: [],
  sellers: [],
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

export const get_sellers = createAsyncThunk(
  "chat/get-sellers",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get(`/chat/admin/get-sellers`);
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const send_message_seller_admin = createAsyncThunk(
  "chat/message-send-seller-admin",
  async (info, thunkAPI) => {
    try {
      const { data } = await api.post(`/chat/message-send-seller-admin`, info);
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const get_admin_message = createAsyncThunk(
  "chat/get-admin-message",
  async (receiverId, thunkAPI) => {
    try {
      const { data } = await api.get(`/chat/get-admin-messages/${receiverId}`);
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const get_seller_message = createAsyncThunk(
  "chat/get-seller-message",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get(`/chat/get-seller-messages`);
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
    updateMessage: (state, action) => {
      state.messages = [...state.messages, action.payload];
    },
    updateCustomer: (state, action) => {
      state.activeCustomer = action.payload;
    },
    updateSellers: (state, action) => {
      state.activeSellers = action.payload;
    },
    updateAdminMessage: (state, action) => {
      state.seller_admin_message = [
        ...state.seller_admin_message,
        action.payload,
      ];
    },
    updateSellerMessage: (state, action) => {
      state.seller_admin_message = [
        ...state.seller_admin_message,
        action.payload,
      ];
    },
    activeStatus_update: (state, action) => {
      state.activeAdmin = action.payload.status;
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
    builder.addCase(get_sellers.fulfilled, (state, action) => {
      state.sellers = action.payload.sellers;
    });
    builder.addCase(send_message_seller_admin.fulfilled, (state, action) => {
      state.seller_admin_message = [
        ...state.seller_admin_message,
        action.payload.message,
      ];
      state.successMessage = "message sent";
    });
    builder.addCase(get_admin_message.fulfilled, (state, action) => {
      state.seller_admin_message = action.payload.messages;
      state.currentSeller = action.payload.currentSeller;
    });
    builder.addCase(get_seller_message.fulfilled, (state, action) => {
      state.seller_admin_message = action.payload.messages;
    });
  },
});

export const {
  messageClear,
  updateMessage,
  updateCustomer,
  updateSellers,
  updateAdminMessage,
  updateSellerMessage,
  activeStatus_update,
} = chatReducer.actions;

export default chatReducer.reducer;
