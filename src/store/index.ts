import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux'
import HomePageReducer from './slices/homepageSlice'
import { StockService } from '../services/stocks.services'

export const store = configureStore({
  reducer: { Homepage: HomePageReducer, [StockService.reducerPath]: StockService.reducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(StockService.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
