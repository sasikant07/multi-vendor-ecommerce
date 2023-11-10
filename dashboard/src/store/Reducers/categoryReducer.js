import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

const initialState = {
  successMessage: "",
  errorMessage: "",
  loader: false,
  categories: [],
};

export const categoryAdd = createAsyncThunk(
  "category/categoryAdd",
  async ({ name, image }, thunkAPI) => {
    try {
      const formdata = new FormData();
      formdata.append("name", name);
      formdata.append("image", image);
      const { data } = await api.post("/category-add", formdata, {
        withCredentials: true,
      });
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const get_category = createAsyncThunk(
  "category/get_category",
  async ({ perPage, page, searchValue}, thunkAPI) => {
    try {
      const { data } = await api.get(`/category-get?page=${page}&&searchValue=${searchValue}&&perPage=${perPage}`, {
        withCredentials: true,
      });
      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const categoryReducer = createSlice({
  name: "category",
  initialState,
  reducers: {
    messageClear: (state, action) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(categoryAdd.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(categoryAdd.fulfilled, (state, action) => {
      state.loader = false;
      state.successMessage = action.payload.message;
      state.categories = [...state.categories, action.payload.category];
    });
    builder.addCase(categoryAdd.rejected, (state, action) => {
      state.loader = false;
      state.errorMessage = action.payload.error;
    });
  },
});

export const { messageClear } = categoryReducer.actions;

export default categoryReducer.reducer;
