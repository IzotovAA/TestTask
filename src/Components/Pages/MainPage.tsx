import styles from "./MainPage.module.scss";
import * as React from "react";
import { useAppSelector } from "../../rtk/hooks";
import {
  selectData,
  selectStatus,
  selectSearchValue,
  selectEndCursor,
} from "../../rtk/slices/requestSlice";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";

interface Column {
  id: "Название" | "Язык" | "Число форков" | "Число звёзд" | "Дата обновления";
  label: string;
  minWidth?: number;
}

const columns: readonly Column[] = [
  { id: "Название", label: "Название", minWidth: 220 },
  { id: "Язык", label: "Язык", minWidth: 120 },
  {
    id: "Число форков",
    label: "Число форков",
    minWidth: 100,
  },
  {
    id: "Число звёзд",
    label: "Число звёзд",
    minWidth: 100,
  },
  {
    id: "Дата обновления",
    label: "Дата обновления",
    minWidth: 120,
  },
];

export default function MainPage() {
  const data = useAppSelector(selectData);
  const status = useAppSelector(selectStatus);
  const searchValue = useAppSelector(selectSearchValue);
  const endCursor = useAppSelector(selectEndCursor);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {JSON.parse(data)
                  .nodes.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
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
            count={JSON.parse(data).nodes.length}
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
      ) : (
        <div className={styles.main}>
          <h1>Добро пожаловать</h1>
        </div>
      )}
    </>
  );
}

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
