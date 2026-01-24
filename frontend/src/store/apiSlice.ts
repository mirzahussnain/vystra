import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; 

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: async (headers) => {
    
      const token = await window.Clerk?.session?.getToken();
      
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  // Tags for caching (User, Subscription, etc.)
  tagTypes: ["User", "Subscription","Video","Search","Notification"], 
  endpoints: () => ({}), 
});