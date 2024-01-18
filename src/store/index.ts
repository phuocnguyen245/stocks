import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux'
import { StockService } from '../services/stocks.services'
import { PaymentService } from './../services/payment.services'
import { UserService } from './../services/user.services'
import StocksReducer from './slices/stockSlice'

export const store = configureStore({
  reducer: {
    Stocks: StocksReducer,
    [StockService.reducerPath]: StockService.reducer,
    [PaymentService.reducerPath]: PaymentService.reducer,
    [UserService.reducerPath]: UserService.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      StockService.middleware,
      PaymentService.middleware,
      UserService.middleware
    )
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
