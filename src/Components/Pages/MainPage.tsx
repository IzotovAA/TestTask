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
} from "../../rtk/slices/requestSlice";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { Box, TableSortLabel } from "@mui/material";
import { visuallyHidden } from "@mui/utils";

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  numeric: boolean;
  disablePadding: boolean;
}

const columns: readonly Column[] = [
  {
    id: "Название",
    label: "Название",
    minWidth: 250,
    numeric: false,
    disablePadding: true,
  },
  {
    id: "Язык",
    label: "Язык",
    minWidth: 150,
    numeric: false,
    disablePadding: false,
  },
  {
    id: "Число форков",
    label: "Число форков",
    minWidth: 80,
    numeric: true,
    disablePadding: false,
  },
  {
    id: "Число звёзд",
    label: "Число звёзд",
    minWidth: 80,
    numeric: true,
    disablePadding: false,
  },
  {
    id: "Дата обновления",
    label: "Дата обновления",
    minWidth: 120,
    numeric: false,
    disablePadding: false,
  },
];

function descendingComparator(a: any, b: any, orderBy: string) {
  let bContent, aContent;

  switch (orderBy) {
    case "Название":
      aContent = a.name;
      bContent = b.name;
      break;

    case "Язык":
      aContent = a.languages.nodes[0]?.name || "";
      bContent = b.languages.nodes[0]?.name || "";
      break;

    case "Число форков":
      aContent = a.forkCount;
      bContent = b.forkCount;
      break;

    case "Число звёзд":
      aContent = a.stargazers.totalCount;
      bContent = b.stargazers.totalCount;
      break;

    case "Дата обновления":
      aContent = a.updatedAtDateFormat;
      bContent = b.updatedAtDateFormat;
      break;

    default:
      break;
  }

  if (bContent < aContent) {
    return -1;
  }
  if (bContent > aContent) {
    return 1;
  }

  return 0;
}

type Order = "asc" | "desc";

function getComparator(
  order: Order,
  orderBy: string
): (a: IDataForRender, b: IDataForRender) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);

    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}

interface EnhancedTableProps {
  // numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  order: Order;
  orderBy: string;
  // rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: string) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {columns.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ px: 1 }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function MainPage() {
  const error = useAppSelector(selectError);
  const status = useAppSelector(selectStatus);
  const dataForRender = useAppSelector(selectDataForRender);
  const rowsPerPageFromStore = useAppSelector(selectRowsPerPage);
  const pageFromStore = useAppSelector(selectPage);
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("Число форков");
  // const [selected, setSelected] = React.useState<readonly string[]>([]);

  const dispatch = useAppDispatch();

  const [page, setPage] = React.useState(pageFromStore);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageFromStore);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    dispatch(setPageInStore(newPage));
  };

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

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
  //   const selectedIndex = selected.indexOf(id);
  //   let newSelected: readonly string[] = [];

  //   if (selectedIndex === -1) {
  //     newSelected = newSelected.concat(selected, id);
  //   } else if (selectedIndex === 0) {
  //     newSelected = newSelected.concat(selected.slice(1));
  //   } else if (selectedIndex === selected.length - 1) {
  //     newSelected = newSelected.concat(selected.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelected = newSelected.concat(
  //       selected.slice(0, selectedIndex),
  //       selected.slice(selectedIndex + 1)
  //     );
  //   }
  //   setSelected(newSelected);
  // };

  const visibleRows = React.useMemo(
    () =>
      stableSort<IDataForRender>(
        dataForRender,
        getComparator(order, orderBy)
      ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, dataForRender]
  );

  return (
    <>
      {status === "completed" ? (
        <>
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
                  // numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  // rowCount={dataForRender.length}
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
                        // onClick={(event) => handleClick(event, row.id)}
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
        </>
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
