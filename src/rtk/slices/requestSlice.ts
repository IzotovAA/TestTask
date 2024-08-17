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
    nodes: [{ name: string }] | [];
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

export const requestSlice = createAppSlice({
  name: "request",
  initialState,

  reducers: (create) => ({
    setError: create.reducer((state, action: PayloadAction<string>) => {
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

    requestToGraphQL: create.asyncThunk(
      async (data: string): Promise<IRecievedData | string> => {
        const result = await requestGraphQL(data);

        return result;
      },

      {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state, action: PayloadAction<IRecievedData | string>) => {
          if (typeof action.payload === "string") {
            state.status = "error";
            state.error = action.payload;
          } else {
            const result: IDataForRender[] = addDateFromat(
              action.payload.nodes
            );

            state.dataForRender = [...state.dataForRender, ...result];

            state.endCursor = action.payload.pageInfo.endCursor;
            state.repositoryCount = action.payload.repositoryCount;

            state.status = "completed";
            state.error = null;
          }
        },
        rejected: (state) => {
          state.status = "failed";
          state.error = "Ошибка asyncThunk requestToGraphQL";
        },
      }
    ),
  }),

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

export const {
  setError,
  setSearchValue,
  resetDataForRender,
  setStatus,
  setRowsPerPage,
  setPage,
  requestToGraphQL,
} = requestSlice.actions;

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
