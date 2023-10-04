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
        issueABook: builder.mutation({
            query: (data) => ({
                url: `${BOOKS_URL}/issue`,
                method: 'POST',
                body: data
            }),
        }),
        returnABook: builder.mutation({
            query: (data) => ({
                url: `${BOOKS_URL}/return`,
                method: 'POST',
                body: data
            })
        }),
    }),
});

export const {
    useListOfBooksMutation,
    useSearchBooksMutation,
    useIssueABookMutation,
    useReturnABookMutation
} = booksApiSlice;
