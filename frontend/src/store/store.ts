import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './apiSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      // Add the generated reducer
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']