import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const booksApi = createApi({
  reducerPath: "booksApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000" }),
  tagTypes: ["Books"],
  endpoints: (builder) => ({
    getAllTheBooks: builder.query({
      query: () => "/books",
      providesTags: ["Books"],
    }),
    postOneBook: builder.mutation({
      query: (data) => ({
        url: "/postBook",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Books"],
    }),
    deleteOneBook: builder.mutation({
      query: (id) => ({
        url: `deletebook/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Books"],
    }),
  }),
});
export const {
  useGetAllTheBooksQuery,
  usePostOneBookMutation,
  useDeleteOneBookMutation,
} = booksApi;
