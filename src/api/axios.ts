import axios from "axios";

export const axiosGraphQL = axios.create({
  baseURL: "https://api.github.com/graphql",
  headers: {
    Authorization: `bearer ${import.meta.env.VITE_AUTH_TOKEN}`,
  },
});
