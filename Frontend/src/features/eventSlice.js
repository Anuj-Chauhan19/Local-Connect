import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080';

axios.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const fetchAllEvents = createAsyncThunk('events/fetchAll', async () => {
  const res = await axios.get('/events');
  return res.data;
});

export const fetchMyEvents = createAsyncThunk('events/fetchMyEvents', async (_, { getState }) => {
  const { token } = getState().user;
  const res = await axios.get('http://localhost:8080/events/my', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
});

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (formData, { rejectWithValue  }) => {
    try {
      const response = await axios.post('http://localhost:8080/events', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}` // if you're using JWT
        }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data || err.message);
    }
  }
);

export const registerEvent = createAsyncThunk('events/register', async (id,{ rejectWithValue }) => {
  try {
     const token = localStorage.getItem("token");
    const res = await axios.post(`http://localhost:8080/events/${id}/register`, {}, {
      withCredentials: true
    },{ headers: {
          Authorization: `Bearer ${token}`,
        }});
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const likeEvent = createAsyncThunk('events/like', async (id) => {
  const res = await axios.post(`/events/${id}/like`);
  return res.data;
});

const eventSlice = createSlice({
  name: 'events',
  initialState: { all: [], mine: [], status: null, error: null },
  extraReducers: (b) => {
    b.addCase(fetchAllEvents.fulfilled, (s, a) => { s.all = a.payload; })
     .addCase(fetchMyEvents.fulfilled, (s, a) => { s.mine = a.payload; })
     .addCase(createEvent.fulfilled, (s, a) => { s.mine.push(a.payload); })
     .addCase(registerEvent.fulfilled, (s, a) => {
       const idx = s.all.findIndex((e) => e._id === a.payload._id);
       if (idx !== -1) s.all[idx] = a.payload;
     })
     .addCase(likeEvent.fulfilled, (s, a) => {
       const idx = s.all.findIndex((e) => e._id === a.payload._id);
       if (idx !== -1) s.all[idx] = a.payload;
     });
  },
});

export default eventSlice.reducer;
