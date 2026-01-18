import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ["Notification"],
  endpoints: (builder) => ({
    markAllAsRead: builder.mutation({
      query: () => ({
        url: "/notifications/mark-all-read",
        method: "PUT",
      }),
      invalidatesTags: ["Notification"],
    }),
    getNotifications: builder.query({
      query: () => ("/notifications"),
      providesTags: ["Notification"],
    }),
    createNotification: builder.mutation({
      query: (data) => ({
        url: "/notifications",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Notification"],
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),
    markNotificationAsRead: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method:"PATCH"
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const { useMarkAllAsReadMutation, useGetNotificationsQuery, useCreateNotificationMutation, useDeleteNotificationMutation, useMarkNotificationAsReadMutation } = notificationApi;