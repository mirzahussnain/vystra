
import { apiSlice } from "../apiSlice";
export const userApi = apiSlice.injectEndpoints({

  endpoints: (builder) => ({
    getUserDetails: builder.query({
      query: () => ({
        url: `/users/me`,
      }),
      providesTags: ["User"]
    }),
    getUserStats:builder.query({
      query: () => ({
        url: `/users/me/usage`,
      }),
      providesTags: ["UserStats"]
    })
    // upgradeUserPlan: builder.mutation({
    //   query: (planId) => ({
    //     url: `/users/me/plan/upgrade`,
    //     method:`POST`,
    //     body: { plan:planId }
    //   })
    // })
  })
})


export const { useGetUserDetailsQuery, useGetUserStatsQuery } = userApi;
