import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

const initialState = {
    successMessage: "",
    errrorMessage: "",
    loader: false,
    userInfo: "",
}

export const admin_login = createAsyncThunk(
    "auth/admin_login",
    async (info) => {
        console.log(info);
        try {
            const {data} = await api.post("/admin-login", info, {withCredentials: true});
            console.log(data);
        } catch (error) {
            
        }
    }
)

export const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {

  },
  extraReducers: {

  }
});

// export const {} = authReducer.actions

export default authReducer.reducer;