import { configureStore } from "@reduxjs/toolkit";
import { requestSlice } from "../rtk/slices/requestSlice";

export const store = configureStore({
  reducer: {
    request: requestSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

// Infer the type of `store`
export type AppStore = typeof store;
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore["dispatch"];
