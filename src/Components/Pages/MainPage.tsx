import styles from "./MainPage.module.scss";
import * as React from "react";
import { useAppDispatch, useAppSelector } from "../../rtk/hooks";
import {
  setRowsPerPage as setRowsPerPageInStore,
  setPage as setPageInStore,
  selectError,
  selectStatus,
  selectSearchValue,
  selectEndCursor,
  selectDataForRender,
  selectRowsPerPage,
  selectPage,
} from "../../rtk/slices/requestSlice";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import {
  Box,
  IconButton,
  TableSortLabel,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";

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
    minWidth: 220,
    numeric: false,
    disablePadding: true,
  },
  {
    id: "Язык",
    label: "Язык",
    minWidth: 120,
    numeric: false,
    disablePadding: false,
  },
  {
    id: "Число форков",
    label: "Число форков",
    minWidth: 100,
    numeric: true,
    disablePadding: false,
  },
  {
    id: "Число звёзд",
    label: "Число звёзд",
    minWidth: 100,
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

export default function MainPage() {
  const error = useAppSelector(selectError);
  const status = useAppSelector(selectStatus);
  const searchValue = useAppSelector(selectSearchValue);
  const endCursor = useAppSelector(selectEndCursor);
  const dataForRender = useAppSelector(selectDataForRender);
  const rowsPerPageFromStore = useAppSelector(selectRowsPerPage);
  const pageFromStore = useAppSelector(selectPage);

  console.log("rowsPerPageFromStore", rowsPerPageFromStore);
  console.log("pageFromStore", pageFromStore);

  const dispatch = useAppDispatch();

  const [page, setPage] = React.useState(pageFromStore);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageFromStore);

  console.log("status", status);
  console.log("error", error);

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

  // реализовать соритровку Sorting & selecting MUI !!!!!!!!!!!!!!!!!!!!

  return (
    <>
      {status === "completed" ? (
        <Paper
          style={{
            width: "100vw",
            overflow: "hidden",
            height: "calc(100vh - 112px)",
          }}
        >
          <TableContainer style={{ height: "calc(100vh - 164px)" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      style={{
                        minWidth: column.minWidth,
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {dataForRender
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: any) => {
                    const updated = row.updatedAt
                      .split("T")[0]
                      .split("-")
                      .reverse()
                      .join(".");
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                        sx={{ fontSize: 14, fontWeight: 400 }}
                      >
                        <TableCell component="th" scope="row">
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

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// return (
//   <>
//     {status === "completed" ? (
//       <Paper
//         style={{
//           width: "100vw",
//           overflow: "hidden",
//           height: "calc(100vh - 112px)",
//         }}
//       >
//         <TableContainer style={{ height: "calc(100vh - 164px)" }}>
//           <Table stickyHeader aria-label="sticky table">
//             <TableHead>
//               <TableRow>
//                 {columns.map((column) => (
//                   <TableCell
//                     key={column.id}
//                     style={{
//                       minWidth: column.minWidth,
//                       fontWeight: 600,
//                       fontSize: 14,
//                     }}
//                   >
//                     {column.label}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {dataForRender
//                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                 .map((row: any) => {
//                   const updated = row.updatedAt
//                     .split("T")[0]
//                     .split("-")
//                     .reverse()
//                     .join(".");
//                   return (
//                     <TableRow
//                       hover
//                       role="checkbox"
//                       tabIndex={-1}
//                       key={row.id}
//                       sx={{ fontSize: 14, fontWeight: 400 }}
//                     >
//                       <TableCell component="th" scope="row">
//                         {row.name}
//                       </TableCell>
//                       <TableCell>
//                         {row.languages.nodes[0]
//                           ? row.languages.nodes[0].name
//                           : "Н/Д"}
//                       </TableCell>
//                       <TableCell>{row.forkCount}</TableCell>
//                       <TableCell>{row.stargazers.totalCount}</TableCell>
//                       <TableCell>{updated}</TableCell>
//                     </TableRow>
//                   );
//                 })}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <TablePagination
//           rowsPerPageOptions={[10, 25, 100]}
//           component="div"
//           count={dataForRender.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </Paper>
//     ) : status === "loading" ? (
//       <div className={styles.main}>
//         <h1>Загрузка</h1>
//       </div>
//     ) : (
//       <div className={styles.main}>
//         <h1>Добро пожаловать</h1>
//       </div>
//     )}
//   </>
// );
// }

{
  /* <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Название</TableCell>
                <TableCell>Язык</TableCell>
                <TableCell>Число форков</TableCell>
                <TableCell>Число звёзд</TableCell>
                <TableCell>Дата обновления</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {JSON.parse(data).data.search.nodes.map((row: any) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell>{row.languages.nodes[0].name}</TableCell>
                  <TableCell>{row.forkCount}</TableCell>
                  <TableCell>{row.stargazers.totalCount}</TableCell>
                  <TableCell>{row.updatedAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer> */
}

{
  /* <div className={styles.main}>
          <div>
            <div>Название</div>
            <div>Язык</div>
            <div>Число форков</div>
            <div>Число звёзд</div>
            <div>Дата обновления</div>
          </div>
          <ul>
            {JSON.parse(data).data.search.nodes.map((elem: any) => {
              return (
                <li key={elem.id}>
                  <div>
                    <div>{elem.name}</div>
                    <div>{elem.languages.nodes[0].name}</div>
                    <div>{elem.forkCount}</div>
                    <div>{elem.stargazers.totalCount}</div>
                    <div>{elem.updatedAt}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div> */
}
