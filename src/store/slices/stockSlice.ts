import { createSlice } from '@reduxjs/toolkit'

// Define a type for the slice state
interface CounterState {
  rsi: number[]
  isRefetchCurrentStock: boolean
}

// Define the initial state using that type
const initialState: CounterState = {
  rsi: [],
  isRefetchCurrentStock: false
}

export const stockSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    refetchCurrentStocks: (state, action) => {
      state.isRefetchCurrentStock = action.payload
    },
    getRSI: (state, action) => {
      state.rsi = action.payload
    }
  }
})

export const { refetchCurrentStocks, getRSI } = stockSlice.actions

export default stockSlice.reducer
