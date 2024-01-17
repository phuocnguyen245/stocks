type Status = 'Buy' | 'Sell'
type LabelType = 'success' | 'error' | 'warning' | 'primary' | 'secondary' | 'info'

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
  error?: string
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

interface Asset {
  topUp: number
  waiting: number
  selling: number
  order: number
  available: number
  net: number
  profitOrLost: number
  investedValue: number
  marketValue: number
}

interface WatchList {
  displayIndex: number
  name: string
  symbols: string[]
  userName: string
  watchlistID: number
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
  liveboard: Liveboard
  SectorID: string
  FinancialTag: string
  CompanyName: string
  SubSectorID: string
  WeightListing: number
  WeightCirculation: number
  Commodities: string
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
  Board
}
