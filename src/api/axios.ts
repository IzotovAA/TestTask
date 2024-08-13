import axios from "axios";

export const axiosGraphQL = axios.create({
  baseURL: "https://api.github.com/graphql",
  headers: {
    Authorization: "bearer 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",
  },
});
