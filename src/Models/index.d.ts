type Status = 'Buy' | 'Sell'
type LabelType = 'success' | 'error' | 'warning' | 'primary' | 'secondary' | 'info'

interface Stock {
  _id: string
  code: string
  date: string
  quantity: number
  purchasePrice: number
  currentPrice?: number
  sellPrice: number
  ratio?: number
  actualGain?: number
  status: Status
  average?: number
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

export type { Stock, Status, ResponsePagination, ResponseType, LabelType }
