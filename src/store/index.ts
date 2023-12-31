import { PaymentService } from './../services/payment.services'
import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux'
import StocksReducer from './slices/stockSlice'
import { StockService } from '../services/stocks.services'

export const store = configureStore({
  reducer: {
    Stocks: StocksReducer,
    [StockService.reducerPath]: StockService.reducer,
    [PaymentService.reducerPath]: PaymentService.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(StockService.middleware, PaymentService.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
