
import { apiSlice } from "../apiSlice";

const subscriptionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation<{ url: string }, { planId: string }>({
      query:({planId}) => ({
        url: `/payments/create-checkout-session`,
        method:`POST`,
        body: { plan:planId }
      }),
      invalidatesTags:["Subscription"],
    }),
    createCustomerPortalSession: builder.mutation<{ url: string }, void>({
          query: () => ({
            url: "/payments/create-customer-portal-session",
            method: "POST",
          }),
        }),
  })
  
})

export const { useCreateCheckoutSessionMutation, useCreateCustomerPortalSessionMutation } = subscriptionApi;