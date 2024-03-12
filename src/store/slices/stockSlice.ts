import { createSlice } from '@reduxjs/toolkit'
import { type Stock } from 'src/models'
// Define a type for the slice state
interface StockState {
  rsi: number[]
  isRefetchStock: boolean
  isOpenSidebar: boolean
  sellStock?: Stock
  mode: 'dark' | 'light' | null
  isMdWindow: boolean
  isLogin: boolean | null
}

// Define the initial state using that type
const initialState: StockState = {
  rsi: [],
  isRefetchStock: false,
  isOpenSidebar: false,
  sellStock: undefined,
  mode: null,
  isMdWindow: false,
  isLogin: null
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
    },
    onSellStock: (state, action) => {
      state.sellStock = action.payload
    },
    onMdWindow: (state, action) => {
      state.isMdWindow = action.payload
    },
    onIsLogin: (state, action) => {
      state.isLogin = action.payload
    }
  }
})

export const {
  refetchStocks,
  getRSI,
  setOpenSidebar,
  setMode,
  onSellStock,
  onMdWindow,
  onIsLogin
} = stockSlice.actions
export default stockSlice.reducer
