import { createSlice } from '@reduxjs/toolkit'

// Define a type for the slice state
interface StockState {
  rsi: number[]
  isRefetchStock: boolean
  isOpenSidebar: boolean
  mode: 'dark' | 'light' | null
}

// Define the initial state using that type
const initialState: StockState = {
  rsi: [],
  isRefetchStock: false,
  isOpenSidebar: false,
  mode: null
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
    },
    setOpenSidebar: (state, action) => {
      state.isOpenSidebar = action.payload
    },
    setMode: (state, action) => {
      state.mode = action.payload
    }
  }
})

export const { refetchStocks, getRSI, setOpenSidebar, setMode } = stockSlice.actions
export default stockSlice.reducer
