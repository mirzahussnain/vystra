
import { apiSlice } from "../apiSlice";
export const userApi = apiSlice.injectEndpoints({

  endpoints: (builder) => ({
    getUserDetails: builder.query({
      query: () => ({
        url: `/users/me`,
      }),
      providesTags: ["User"]
    }),
    // upgradeUserPlan: builder.mutation({
    //   query: (planId) => ({
    //     url: `/users/me/plan/upgrade`,
    //     method:`POST`,
    //     body: { plan:planId }
    //   })
    // })
  })
})


export const { useGetUserDetailsQuery } = userApi;
