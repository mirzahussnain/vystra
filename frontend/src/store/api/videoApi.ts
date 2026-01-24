
import { apiSlice } from "../apiSlice";
export const videosApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get All Videos (Supports Search)
    getVideos: builder.query({
      query: ({ search }) => ({
        url: "/videos",
        params: {
          search,
        },
      }),
      providesTags: ["Video"],
    }),
    // Get Dashboard Video Stats
    getDashboardStats: builder.query({
      query: () => ({
        url: `/videos/stats`,
      }),
      providesTags: ["Video"],
    }),
    // Get Single Video (For later)
    getVideoById: builder.query({
      query: (video_id) => {
        return {
          url: `/videos/${video_id}`,
          
        };
      },
    }),
    getVideoUrl: builder.query({
      query: (video_id) => `/videos/${video_id}/url`,
      // Cache the link for 15 mins so we don't spam the server if they pause/play
      keepUnusedDataFor: 900,
    }),
    // uploadVideo: builder.mutation({
    //   query: (formData) => ({
    //     url: "/upload",
    //     method: "POST",
    //     body: formData,
    //   }),
    //   invalidatesTags: ["Video"], // Auto-refresh the list after upload
    // }),
    getUploadUrl: builder.mutation<
      { upload_url: string; video_id: string },
      { filename: string; file_size: number; content_type: string }
    >({
      query: (body) => ({
        url: "/upload-url",
        method: "POST",
        body,
      }),
    }),
    // 2.  Confirm Upload (Triggers Worker)
    confirmUpload: builder.mutation<void, { video_id: string }>({
      query: ({ video_id }) => ({
        url: `/${video_id}/confirm-upload`,
        method: "POST",
      }),
      invalidatesTags: ["Video"], 
    }),
    deleteVideo: builder.mutation({
      query: (video_id) => ({
        url: `/videos/${video_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Video"], // Auto-refresh the list after deletion
    }),
    semanticSearchVideos: builder.query({
      query: ({ search, video_id }) => {
        return {
          url: "/search",
          params: {
            q: search,
            video_id,
          },
        };
      },
      providesTags: (result, error, { video_id }) => [
        { type: "Search", id: video_id || "GLOBAL" },
      ],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetVideosQuery,
  useGetVideoByIdQuery,
  useGetUploadUrlMutation,
    useConfirmUploadMutation,
  useGetVideoUrlQuery,
  useDeleteVideoMutation,
  useSemanticSearchVideosQuery,
  useLazySemanticSearchVideosQuery,
  useLazyGetVideosQuery,
  useLazyGetVideoByIdQuery,
} = videosApi;
