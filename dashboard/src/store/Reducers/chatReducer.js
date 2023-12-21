import { createSlice } from "@reduxjs/toolkit";

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
  async (info, thunkAPI) => {
    try {
      const { data } = await api.get("/chat/seller/get-customers", info);
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
    // builder.addCase(add_friend.fulfilled, (state, action) => {
    //   state.fd_messages = action.payload.messages;
    //   state.currentFd = action.payload.currentFd;
    //   state.my_friends = action.payload.myFriends;
    // });
  },
});

export const { messageClear } = chatReducer.actions;

export default chatReducer.reducer;
