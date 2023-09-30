import {apiSlice} from "./apiSlice";

const TICKETS_URL = '/api/tickets';

export const ticketsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        extendTicket: builder.mutation({
            query: (data) => ({
                url: `${TICKETS_URL}/extend`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: data
            })
        }),
        createTicket: builder.mutation({
            query: (data) => ({
                url: `${TICKETS_URL}/create`,
                method: 'POST',
                body: data
            })
        })
    }),
});

export const {useExtendTicketMutation, useCreateTicketMutation} = ticketsApiSlice;
