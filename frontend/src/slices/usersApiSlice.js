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
    }),
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useUpdateUserMutation,
    useFetchUsersMutation,
    useSearchUsersMutation
} = usersApiSlice;
