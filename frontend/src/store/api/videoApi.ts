import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export const videosApi = createApi({
  reducerPath: "videosApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }), // Make sure port matches your FastAPI
  tagTypes: ["Video"],
  endpoints: (builder) => ({
    // Get All Videos (Supports Search)
    getVideos: builder.query({
      query: (search) => (search ? `/videos?search=${search}` : "/videos"),
      providesTags: ["Video"],
    }),

    // Get Single Video (For later)
    getVideoById: builder.query({
      query: (video_id) => `/videos/${video_id}`,
    }),
    getVideoUrl: builder.query({
      query: (video_id) => `/videos/${video_id}/url`,
      // Cache the link for 15 mins so we don't spam the server if they pause/play
      keepUnusedDataFor: 900,
    }),
    uploadVideo: builder.mutation({
      query: (formData) => ({
        url: "/upload",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Video"], // Auto-refresh the list after upload
    }),
    deleteVideo: builder.mutation({
      query: (video_id) => ({
        url: `/videos/${video_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Video"], // Auto-refresh the list after deletion
    }),
  }),
});

export const {
  useGetVideosQuery,
  useGetVideoByIdQuery,
  useUploadVideoMutation,
  useGetVideoUrlQuery,
  useDeleteVideoMutation,
} = videosApi;
