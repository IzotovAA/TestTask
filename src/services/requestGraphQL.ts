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

export default async function requestGraphQL(
  data: string
): Promise<IRecievedData | string> {
  const result = await axiosGraphQL
    .post("", { query: data })
    .then((res) => {
      console.log("res", res);

      if (Boolean(res.data?.data?.search) === true) {
        console.log("res.data.data.search");

        return res.data.data.search;
      } else if (Boolean(res.data?.errors) === true) {
        console.log("res.data.errors");

        return res.data.errors[0].message;
      } else {
        console.log("else");

        return "не понятная ошибка запроса к GraphQLAPI";
      }
    })
    .catch((error) => {
      console.log("catch error", error);

      return error;
    });

  return result;
}
