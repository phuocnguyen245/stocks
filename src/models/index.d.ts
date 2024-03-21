type Status = 'Buy' | 'Sell'
type LabelType = 'success' | 'error' | 'warning' | 'primary' | 'secondary' | 'info' | 'default'

interface User {
  _id?: string
  name: string
  username: string
  password: string
  createdAt?: string
  updatedAt?: string
}

interface UserWithToken extends User {
  tokens: {
    access: string
    refresh: string
  }
}

interface Target {
  name: string
  price: number
  volume: number
}

interface Stock {
  _id: string
  code: string
  date: string
  volume: number
  orderPrice: number
  marketPrice?: number
  sellPrice: number
  ratio?: number
  investedValue?: number
  status: Status
  averagePrice?: number
  createdAt?: string
  updatedAt?: string
  t?: number
  stocks?: Stock[]
  take: Target[]
  stop: Target[]
  sector: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unavailableVol?: number
  availableVol?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}
export interface ResponsePagination<T> {
  data?: T
  size: number
  page: number
  totalItems: number
}
export interface ResponseType<T> {
  data?: T
  message?: ResponseMessage
  status?: number
  subMessage?: string
}

interface Payments {
  name: string
  type: PaymentType
  balance: number
  isDelete?: boolean
  createdBy?: string
  updatedBy?: string
  date: string
  _id?: string
}

interface Chart {
  name: string
  y: number
}
interface Asset {
  topUp: number
  cash: number
  waiting: number
  sell: number
  order: number
  available: number
  net: number
  profitOrLost: number
  investedValue: number
  marketValue: number
  ratePortfolio: number
  profitOrLoss: number
  rateAsset: number
  sectorsPercentage: Chart[]
  stocksPercentage: Chart[]
}

interface WatchList {
  displayIndex: number
  name: string
  symbols: string[]
  userName: string
  watchlistID: number
  stocks: Board[]
}
interface MACD {
  macd: number[]
  signal: number[]
}
interface MA {
  ma10: number[]
  ma20: number[]
  ma50: number[]
  ma100: number[]
  ma150: number[]
  ma200: number[]
}

interface Stoch {
  d: number[]
  k: number[]
}
interface Indicator {
  macd: MACD
  ma: MA
  mfi: number[]
  rsi: number[]
  stoch: Stoch
  stochRSI: Stoch
  lastPrice: number
  code: string
}

interface RecommendedStocks {
  macd: {
    macd: number
    signal: number
  }
  mfi: number
  rsi: nnumber
  stoch: {
    k: number
    d: number
  }
  stochRSI: {
    k: number
    d: number
  }
  code: string
  lastPrice: string
}

interface Liveboard {
  Symbol: string
  Open: number
  Reference: number
  Close: number
  High: number
  Low: number
  AveragePrice: number
  Ceiling: number
  Floor: number
  MatchVolume: number
  Change: number
  ChangePercent: number
  BidPrice1: string
  BidVolume1: number
  BidPrice2: number
  BidVolume2: number
  BidPrice3: number
  BidVolume3: number
  OfferPrice1: string
  OfferVolume1: number
  OfferPrice2: number
  OfferVolume2: number
  OfferPrice3: number
  OfferVolume3: number
  TotalVolume: number
  TotalValue: number
  RemainForeignVolume: number
  OverBuy: number
  OverSell: number
  ForeignBuy: number
  ForeignBuyValue: number
  ForeignSell: number
  ForeignSellValue: number
  ActiveBuyVol: number
  ActiveSellVol: number
  Exchange: string
  ModifiedDate: string
}

interface Board {
  symbol: string
  companyName: string
  close: number
  change: number
  changePercent: number
  sector: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ErrorResponse1 {
  message: string
  subMessage: string
}

interface Error {
  error?: FetchBaseQueryError | SerializedError | undefined
}

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true // removes the `xs` breakpoint
    sm: true
    md: true
    lg: true
    xl: true
  }
}
declare module 'react' {
  interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
    fetchPriority?: 'high' | 'low' | 'auto'
  }
}

export type {
  Stock,
  Status,
  ResponsePagination,
  ResponseType,
  LabelType,
  Payments,
  Asset,
  WatchList,
  Indicator,
  MACD,
  MA,
  Stoch,
  Board,
  User,
  UserWithToken,
  ErrorResponse1,
  Target,
  RecommendedStocks
}
