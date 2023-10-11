import {apiSlice} from "./apiSlice.js";

const EVENTS_URL = '/api/events';

export const eventsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        bookEvents: builder.mutation({
            query: () => ({
                url: `${EVENTS_URL}/book-events`,
                method: 'GET'
            })
        }),
        bookEventsByUser: builder.query({
            query: (id) => ({
                url: `${EVENTS_URL}/book-events/${id}`,
                method: 'GET'
            })
        }),
        ticketEvents: builder.mutation({
            query: () => ({
                url: `${EVENTS_URL}/ticket-events`,
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
    useBookEventsMutation,
    useBookEventsByUserQuery,
    useTicketEventsMutation,
    useAllEventsMutation
} = eventsApiSlice;
