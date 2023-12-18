type Status = 'Buy' | 'Sell'

interface StockProps {
  id: string
  code: string
  date: string
  quantity: number
  purchasePrice: number
  currentPrice?: number
  ratio?: number
  actualGain?: number
  status: Status
  abc?: boolean
}
export type { StockProps, Status }
