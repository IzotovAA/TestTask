interface Column {
  id: string;
  label: string;
  minWidth?: number;
  numeric: boolean;
  disablePadding: boolean;
}

export const columns: readonly Column[] = [
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
