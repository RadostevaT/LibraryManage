import {apiSlice} from "./apiSlice";

const USERS_URL = '/api/users';

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/auth`,
                method: 'POST',
                body: data
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}`,
                method: 'POST',
                body: data
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: 'POST',
            }),
        }),
        getUser: builder.query({
            query: () => ({
                url: '/api/users/profile',
                method: 'GET',
            }),
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profile`,
                method: 'PUT',
                body: data,
            }),
        }),
        fetchUsers: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/all-readers`,
                method: 'GET',
            }),
        }),
        searchUsers: builder.mutation({
            query: (query) => ({
                url: `${USERS_URL}/all-readers?query=${query}`,
                method: 'GET',
            }),
        }),
        createReaderTicket: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/create-reader-ticket`,
                method: 'POST',
                body: data
            })
        }),
        extendReaderTicket: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/extend-reader-ticket`,
                method: 'POST',
                body: data
            })
        }),
    }),
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useGetUserQuery,
    useUpdateUserMutation,
    useFetchUsersMutation,
    useSearchUsersMutation,
    useCreateReaderTicketMutation,
    useExtendReaderTicketMutation
} = usersApiSlice;
