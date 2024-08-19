import { IDataForRender } from "../rtk/slices/requestSlice";

// принимает два объекта (данных о репозиториях) и сравнивает их основываясь на orderBy
function descendingComparator(
  a: IDataForRender,
  b: IDataForRender,
  orderBy: string
) {
  let bContent: string | number | Date = "";
  let aContent: string | number | Date = "";

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
      aContent = a.updatedAtDateFormat || 0;
      bContent = b.updatedAtDateFormat || 0;
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

export type Order = "asc" | "desc";

// отвечает за сравнение двух объектов (данных о репозиториях) основываясь на order,
// принимает аргумент сортировки по возрастанию или убыванию, аргумент с информацией
// по какому полю нужно сортировать, запускает функцию сравнения двух объектов, возвращает результат сравнения
export function getComparator(
  order: Order,
  orderBy: string
): (a: IDataForRender, b: IDataForRender) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// отвечает за сортировку, принимает массив с объектами (данных о репозиториях) и функцию
// которая может сравнить два объекта, на основании результатов сравнения сортирует массив
export function stableSort<T>(
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
