import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// --- Async thunk to fetch sports products ---
export const fetchToysProducts = createAsyncThunk(
  "toys/fetchToysProducts",
  async () => {
    const response = await axios.get("http://localhost:3010/Toys");
    return response.data;
  }
);

const toysSlice = createSlice({
  name: "Toys",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchToysProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchToysProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchToysProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default toysSlice.reducer;
