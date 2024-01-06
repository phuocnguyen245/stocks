import { createSlice } from '@reduxjs/toolkit'

// Define a type for the slice state
interface CounterState {
  rsi: number[]
  isRefetchStock: boolean
}

// Define the initial state using that type
const initialState: CounterState = {
  rsi: [],
  isRefetchStock: false
}

export const stockSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    refetchStocks: (state, action) => {
      state.isRefetchStock = action.payload
    },
    getRSI: (state, action) => {
      state.rsi = action.payload
    }
  }
})

export const { refetchStocks, getRSI } = stockSlice.actions

export default stockSlice.reducer
