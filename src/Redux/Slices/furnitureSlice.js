import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// --- Async thunk to fetch sports products ---
export const fetchFurnitureProducts = createAsyncThunk(
  "furniture/fetchFurnitureProducts",
  async () => {
    const response = await axios.get("http://localhost:3009/Furniture");
    return response.data;
  }
);

const furnitureSlice = createSlice({
  name: "Furniture",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFurnitureProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFurnitureProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchFurnitureProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default furnitureSlice.reducer;
