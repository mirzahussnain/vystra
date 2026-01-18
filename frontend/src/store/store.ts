import { configureStore } from '@reduxjs/toolkit'
import { videosApi } from '@/store/api/videoApi' // We'll create this next
import { notificationApi } from './api/notificationApi'

export const makeStore = () => {
  return configureStore({
    reducer: {
      // Add the generated reducer
      [videosApi.reducerPath]: videosApi.reducer,
      [notificationApi.reducerPath]: notificationApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(videosApi.middleware).concat(notificationApi.middleware),
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']