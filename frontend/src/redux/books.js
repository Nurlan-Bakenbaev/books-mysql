import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const booksApi = createApi({
  reducerPath: "booksApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000" }),
  endpoints: (builder) => ({
    getAllTheBooks: builder.query({
      query: () => "books",
    }),
  }),
});
export const { useGetAllTheBooksQuery } = booksApi;
