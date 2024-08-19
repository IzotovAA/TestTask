import { axiosGraphQL } from "../api/axios";
import { IDataForRender } from "../rtk/slices/requestSlice";

export interface IRecievedData {
  nodes: IDataForRender[];
  pageInfo: {
    endCursor: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
  };
  repositoryCount: number;
}

// осуществялет запрос к GitHub GraphQLAPI
export default async function requestGraphQL(
  data: string
): Promise<IRecievedData | string> {
  const result = await axiosGraphQL
    .post("", { query: data })
    .then((res) => {
      if (Boolean(res.data?.data?.search) === true) {
        return res.data.data.search;
      } else if (Boolean(res.data?.errors) === true) {
        return res.data.errors[0].message;
      } else {
        return "Непонятная ошибка запроса к GraphQLAPI";
      }
    })
    .catch((error) => {
      return error;
    });

  return result;
}
