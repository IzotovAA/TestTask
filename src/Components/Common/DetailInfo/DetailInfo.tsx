import { useState } from "react";
import styles from "./DetailInfo.module.scss";
import { Button, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../rtk/hooks";
import {
  setError,
  setSearchValue,
  setStatus,
  setPage as setPageInStore,
  resetDataForRender,
  requestToGraphQL,
  // selectError,
  // selectStatus,
  selectSearchValue,
  selectEndCursor,
  selectDataForRender,
  selectRepositoryCount,
} from "../../../rtk/slices/requestSlice";

// реализовать отображение детальной информации при нажатии на строку

export default function DetailInfo() {
  const searchValue = useAppSelector(selectSearchValue);
  const endCursor = useAppSelector(selectEndCursor);
  const dataForRender = useAppSelector(selectDataForRender);

  return <div></div>;
}
