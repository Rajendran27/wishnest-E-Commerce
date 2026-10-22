import { configureStore } from "@reduxjs/toolkit";
import sportsReducer from "./Slices/sportsSlice";
import toysReducer from "./Slices/toysSlice"
import furnitureReducer from "./Slices/furnitureSlice"

export const store = configureStore({
  reducer: {
    sports: sportsReducer,
    toys: toysReducer,
    furniture: furnitureReducer
  },
});
