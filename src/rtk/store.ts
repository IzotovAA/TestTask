import { configureStore } from "@reduxjs/toolkit";
import { requestSlice } from "../rtk/slices/requestSlice";

export const store = configureStore({
  reducer: {
    request: requestSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppStore = typeof store;
export type AppDispatch = AppStore["dispatch"];
