import { IDataForRender } from "../rtk/slices/requestSlice";

export default function addDateFromat(arr: IDataForRender[]): IDataForRender[] {
  const result = arr.map((elem: IDataForRender) => {
    elem.updatedAtDateFormat = new Date(elem.updatedAt);
    return elem;
  });

  return result;
}
