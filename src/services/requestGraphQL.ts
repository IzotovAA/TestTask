import { axiosGraphQL } from "../api/axios";

export default async function requestGraphQL(data: string): Promise<any> {
  let result;
  try {
    result = await axiosGraphQL.post("", { query: data }).then((result) => {
      console.log("result", result);
      return result.data.data.search;
    });
  } catch (error) {
    result = error;
    console.log("Возникла ошибка при запросе", error);
  }

  console.log("typeof result", typeof result);
  return result;
}

// const result = await axiosGraphQL.post("", { query: data }).then((result) => {
//   console.log("result", result);

//   return result.data;
