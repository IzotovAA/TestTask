import type { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../createAppSlice";
import requestGraphQL from "../../services/requestGraphQL";
import { act } from "react";

interface IDataForRender {
  [index: number]: {
    desription: string | null;
    forkCount: number;
    id: string;
    name: string;
    updatedAt: string;
    url: string;
    languages: {
      [index: number]: { name: string } | null;
    };
    licenseInfo: { name: string } | null;
    stargazers: { totalCount: number };
  };
}

export interface IRequestSliceState {
  data: string;
  status: "completed" | "loading" | "failed" | null;
  searchValue: string;
  endCursor: string;
  dataForRender: IDataForRender[] | [];
  repositoryCount: number;
}

const initialState: IRequestSliceState = {
  data: "",
  status: null,
  searchValue: "",
  endCursor: "",
  dataForRender: [],
  repositoryCount: 0,
};

// If you are not using async thunks you can use the standalone `createSlice`.
export const requestSlice = createAppSlice({
  name: "request",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (create) => ({
    setData: create.reducer((state, action: PayloadAction<string>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.data = action.payload;
    }),

    setSearchValue: create.reducer((state, action: PayloadAction<string>) => {
      state.searchValue = action.payload;
    }),

    // The function below is called a thunk and allows us to perform async logic. It
    // can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
    // will call the thunk with the `dispatch` function as the first argument. Async
    // code can then be executed and other actions can be dispatched. Thunks are
    // typically used to make async requests.
    requestToGraphQL: create.asyncThunk(
      async (data: string): Promise<any> => {
        const response = await requestGraphQL(data);
        // The value we return becomes the `fulfilled` action payload

        return response;
      },
      {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state, action) => {
          console.log("action.payload", action.payload);

          state.data = JSON.stringify(action.payload);
          state.dataForRender = state.dataForRender.concat(
            action.payload.nodes
          );
          state.endCursor = action.payload.pageInfo.endCursor;
          state.repositoryCount = action.payload.repositoryCount;

          state.status = "completed";

          console.log("state.dataForRender", state.dataForRender);

          // реализовать хранение в хранилище массива с нужными данными и добавления туда нового поиска по конечному курсору
        },
        rejected: (state) => {
          state.status = "failed";
        },
      }
    ),
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectData: (request) => request.data,
    selectStatus: (request) => request.status,
    selectSearchValue: (request) => request.searchValue,
    selectEndCursor: (request) => request.endCursor,
    selectDataForRender: (request) => request.dataForRender,
    selectRepositoryCount: (request) => request.repositoryCount,
  },
});

// Action creators are generated for each case reducer function.
export const { setData, setSearchValue, requestToGraphQL } =
  requestSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const {
  selectData,
  selectStatus,
  selectSearchValue,
  selectEndCursor,
  selectDataForRender,
  selectRepositoryCount,
} = requestSlice.selectors;
