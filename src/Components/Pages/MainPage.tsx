import styles from "./MainPage.module.scss";
import * as React from "react";
import { useAppDispatch, useAppSelector } from "../../rtk/hooks";
import {
  setRowsPerPage as setRowsPerPageInStore,
  setPage as setPageInStore,
  selectError,
  selectStatus,
  selectDataForRender,
  selectRowsPerPage,
  selectPage,
  IDataForRender,
  setDetailIsActive,
} from "../../rtk/slices/requestSlice";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import DetailInfo from "../Common/DetailInfo/DetailInfo";
import { getComparator, Order, stableSort } from "../../utils/helpers";
import EnhancedTableHead from "../Common/EnhancedTableHead/EnhancedTableHead";

export default function MainPage() {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectError);
  const status = useAppSelector(selectStatus);
  const dataForRender = useAppSelector(selectDataForRender);
  const rowsPerPageFromStore = useAppSelector(selectRowsPerPage);
  const pageFromStore = useAppSelector(selectPage);
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("Число форков");
  const [isActive, setIsActive] = React.useState<boolean>(false);
  const [id, setId] = React.useState<string>("");
  const [page, setPage] = React.useState(pageFromStore);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageFromStore);

  // обрабатывает переключение пагинации
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    dispatch(setPageInStore(newPage));
  };

  // обрабатывает выбор количестива отображаемых строк на странице
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    dispatch(setRowsPerPageInStore(+event.target.value));
    setPage(0);
  };

  React.useEffect(() => {
    setPage(pageFromStore);
  }, [pageFromStore]);

  // обрабатывает запрос на сортировку
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const visibleRows = React.useMemo(
    () =>
      stableSort<IDataForRender>(
        dataForRender,
        getComparator(order, orderBy)
      ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, dataForRender]
  );

  // обрабатывает клик по строке
  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    setIsActive(true);
    setId(id);
    dispatch(setDetailIsActive(true));
  };

  return (
    <>
      {status === "completed" ? (
        <div className={styles.container}>
          <Paper
            style={{
              width: "67vw",
              overflow: "hidden",
              height: "calc(100vh - 112px)",
            }}
          >
            <TableContainer style={{ height: "calc(100vh - 164px)" }}>
              <Table stickyHeader aria-label="sticky table">
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {visibleRows.map((row, index) => {
                    const updated = row.updatedAt
                      .split("T")[0]
                      .split("-")
                      .reverse()
                      .join(".");

                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.id)}
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                        sx={{ fontSize: 14, fontWeight: 400 }}
                      >
                        <TableCell component="th" id={labelId} scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell>
                          {row.languages.nodes[0]
                            ? row.languages.nodes[0].name
                            : "Н/Д"}
                        </TableCell>
                        <TableCell>{row.forkCount}</TableCell>
                        <TableCell>{row.stargazers.totalCount}</TableCell>
                        <TableCell>{updated}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={dataForRender.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
          <DetailInfo isActive={isActive} id={id} />
        </div>
      ) : status === "loading" ? (
        <div className={styles.main}>
          <h1>Загрузка</h1>
        </div>
      ) : status === "error" ? (
        <div className={styles.mainError}>
          <h1>Произошла ошибка</h1>
          <div>{error}</div>
        </div>
      ) : (
        <div className={styles.main}>
          <h1>Добро пожаловать</h1>
        </div>
      )}
    </>
  );
}
