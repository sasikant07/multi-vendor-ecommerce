import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

const initialState = {
  categories: [],
};

export const get_category = createAsyncThunk(
  "category/get-category",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/home/get-categories");
      //   localStorage.setItem("accessToken", data.token);
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const homeReducer = createSlice({
  name: "home",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(get_category.pending, (state) => {
    });
    builder.addCase(get_category.fulfilled, (state, action) => {
        state.categories = action.payload.categories;
    });
    builder.addCase(get_category.rejected, (state, action) => {
    });
  },
});

// export const {} = homeReducer.actions;

export default homeReducer.reducer;
