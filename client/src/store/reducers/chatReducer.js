import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

const initialState = {
  my_friends: [],
  fd_messages: [],
  currentFd: "",
  successMessage: "",
};

export const add_friend = createAsyncThunk(
  "chat/add-friend",
  async (info, thunkAPI) => {
    try {
      const { data } = await api.post(
        "/chat/customer/add-customer-friend",
        info
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
        "/chat/customer/send-message-to-seller",
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
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(add_friend.fulfilled, (state, action) => {
      state.fd_messages = action.payload.messages;
      state.currentFd = action.payload.currentFd;
      state.my_friends = action.payload.myFriends;
    });
    builder.addCase(send_message.fulfilled, (state, action) => {
      let tempFriends = state.my_friends;
      let index = tempFriends.findIndex(
        (f) => f.fdId === action.payload.message.receiverId
      );

      while (index > 0) {
        let temp = tempFriends[index];
        tempFriends[index] = tempFriends[index - 1];
        tempFriends[index - 1] = temp;

        index--;
      }
      state.my_friends = tempFriends;
      state.fd_messages = [...state.fd_messages, action.payload.message];
      state.successMessage = "Message sent";
    });
  },
});

// export const {} = chatReducer.actions

export default chatReducer.reducer;
