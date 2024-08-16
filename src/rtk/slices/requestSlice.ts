import type { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../createAppSlice";
import requestGraphQL, { IRecievedData } from "../../services/requestGraphQL";
import addDateFromat from "../../utils/addDateFormat";

export interface IDataForRender {
  desription: string | null;
  forkCount: number;
  id: string;
  name: string;
  updatedAt: string;
  updatedAtDateFormat?: Date;
  url: string;
  languages: {
    [index: number]: { name: string } | null;
  };
  licenseInfo: { name: string } | null;
  stargazers: { totalCount: number };
}

export interface IRequestSliceState {
  error: string | null;
  status: "completed" | "loading" | "failed" | "error" | null;
  searchValue: string;
  endCursor: string;
  dataForRender: IDataForRender[] | [];
  repositoryCount: number;
  rowsPerPage: number;
  page: number;
}

const initialState: IRequestSliceState = {
  error: null,
  status: null,
  searchValue: "",
  endCursor: "",
  dataForRender: [],
  repositoryCount: 0,
  rowsPerPage: 10,
  page: 0,
};

// If you are not using async thunks you can use the standalone `createSlice`.
export const requestSlice = createAppSlice({
  name: "request",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (create) => ({
    setError: create.reducer((state, action: PayloadAction<string>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.error = action.payload;
    }),

    setSearchValue: create.reducer((state, action: PayloadAction<string>) => {
      state.searchValue = action.payload;
    }),

    resetDataForRender: create.reducer((state) => {
      state.dataForRender = [];
    }),

    setStatus: create.reducer(
      (
        state,
        action: PayloadAction<
          "completed" | "loading" | "failed" | "error" | null
        >
      ) => {
        state.status = action.payload;
      }
    ),

    setRowsPerPage: create.reducer((state, action: PayloadAction<number>) => {
      state.rowsPerPage = action.payload;
    }),

    setPage: create.reducer((state, action: PayloadAction<number>) => {
      state.page = action.payload;
    }),

    // The function below is called a thunk and allows us to perform async logic. It
    // can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
    // will call the thunk with the `dispatch` function as the first argument. Async
    // code can then be executed and other actions can be dispatched. Thunks are
    // typically used to make async requests.
    requestToGraphQL: create.asyncThunk(
      async (data: string): Promise<IRecievedData | string> => {
        const result = await requestGraphQL(data);
        // The value we return becomes the `fulfilled` action payload

        console.log("result", result);

        return result;
      },

      {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state, action: PayloadAction<IRecievedData | string>) => {
          console.log("action.payload", action.payload);

          if (typeof action.payload === "string") {
            state.status = "error";
            state.error = action.payload;
            console.log("error");
          } else {
            const recieved: IDataForRender[] = action.payload.nodes;
            const result: IDataForRender[] = addDateFromat(recieved);

            state.dataForRender = [...state.dataForRender, ...result];

            state.endCursor = action.payload.pageInfo.endCursor;
            state.repositoryCount = action.payload.repositoryCount;

            state.status = "completed";
            state.error = null;

            console.log("state.dataForRender", state.dataForRender);
          }

          // реализовать хранение в хранилище массива с нужными данными и добавления туда нового поиска по конечному курсору
        },
        rejected: (state) => {
          console.log("rejected");

          state.status = "failed";

          console.log("state", state);
          // state.error = "Ошибка asyncThunk requestToGraphQL";
        },
      }
    ),
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectError: (request) => request.error,
    selectStatus: (request) => request.status,
    selectSearchValue: (request) => request.searchValue,
    selectEndCursor: (request) => request.endCursor,
    selectDataForRender: (request) => request.dataForRender,
    selectRepositoryCount: (request) => request.repositoryCount,
    selectRowsPerPage: (request) => request.rowsPerPage,
    selectPage: (request) => request.page,
  },
});

// Action creators are generated for each case reducer function.
export const {
  setError,
  setSearchValue,
  resetDataForRender,
  setStatus,
  setRowsPerPage,
  setPage,
  requestToGraphQL,
} = requestSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const {
  selectError,
  selectStatus,
  selectSearchValue,
  selectEndCursor,
  selectDataForRender,
  selectRepositoryCount,
  selectRowsPerPage,
  selectPage,
} = requestSlice.selectors;
