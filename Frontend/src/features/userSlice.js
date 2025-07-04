import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (creds, { rejectWithValue }) => {
    try {
      const res = await axios.post('http://localhost:8080/login', creds);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post('http://localhost:8080/signup', data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: { token: localStorage.getItem('token'), userInfo: JSON.parse(localStorage.getItem('userInfo')), status: null, error: null },
  reducers: {
    logout(state) {
      state.token = null;
      state.userInfo = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.userInfo = action.payload.user;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('userInfo', JSON.stringify(action.payload.user));

        state.status = 'succeeded';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload.message;
        state.status = 'failed';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.userInfo = action.payload.user;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('userInfo', JSON.stringify(action.payload.user));

        state.status = 'succeeded';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload.message;
        state.status = 'failed';
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
