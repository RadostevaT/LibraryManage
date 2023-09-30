import {apiSlice} from "./apiSlice";

const BOOKS_URL = '/api/books';

export const booksApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        listOfBooks: builder.mutation({
            query: () => ({
                url: `${BOOKS_URL}`,
                method: 'GET',
            }),
        }),
        searchBooks: builder.mutation({
            query: (query) => ({
                url: `${BOOKS_URL}?query=${query}`,
                method: 'GET',
            }),
        }),
    }),
});

export const {useListOfBooksMutation, useSearchBooksMutation} = booksApiSlice;
