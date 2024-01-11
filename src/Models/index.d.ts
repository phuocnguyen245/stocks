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
export type {
  Stock,
  Status,
  ResponsePagination,
  ResponseType,
  LabelType,
  Payments,
  Asset,
  WatchList
}
