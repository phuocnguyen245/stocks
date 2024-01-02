import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

// Define a type for the slice state
interface CounterState {
  value: number
  isRefetchCurrentStock: boolean
}

// Define the initial state using that type
const initialState: CounterState = {
  value: 0,
  isRefetchCurrentStock: false
}

export const stockSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    refetchCurrentStocks: (state, action) => {
      state.isRefetchCurrentStock = action.payload
    }
  }
})

export const { refetchCurrentStocks } = stockSlice.actions

export default stockSlice.reducer
