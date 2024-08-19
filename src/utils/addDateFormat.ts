import { IDataForRender } from "../rtk/slices/requestSlice";

// принимает массив с данными, добавляет в каждый элемент поле updatedAtDateFormat
// и присваивает ему объект даты взятой из строки, это поле нужно для сортировке списка
// репозиториев по дате
export default function addDateFromat(arr: IDataForRender[]): IDataForRender[] {
  const result = arr.map((elem: IDataForRender) => {
    elem.updatedAtDateFormat = new Date(elem.updatedAt);
    return elem;
  });

  return result;
}
