import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// --- Async thunk to fetch sports products ---
export const fetchSportsProducts = createAsyncThunk(
  "sports/fetchSportsProducts",
  async () => {
    const response = await axios.get("http://localhost:3008/Sports");
    return response.data;
  }
);

const sportsSlice = createSlice({
  name: "sports",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSportsProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSportsProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchSportsProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default sportsSlice.reducer;
