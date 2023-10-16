import {apiSlice} from "./apiSlice.js";

const EVENTS_URL = '/api/events';

export const eventsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        bookEventsByUser: builder.query({
            query: (id) => ({
                url: `${EVENTS_URL}/book-events/${id}`,
                method: 'GET'
            })
        }),
        allEvents: builder.mutation({
            query: () => ({
                url: `${EVENTS_URL}/all-events`,
                method: 'GET'
            })
        })
    }),
});

export const {
    useBookEventsByUserQuery,
    useAllEventsMutation
} = eventsApiSlice;
