type ChartLabelType = 'strong' | 'recommended' | 'hold' | 'sell' | 'force'

interface ChartLabel {
  type: 'success' | 'info' | 'error'
  message: string
}

type ChartLabelOptions = Record<ChartLabelType, ChartLabel>

const chartLabelOptions: ChartLabelOptions = {
  strong: {
    type: 'success',
    message: 'Strong Buy Recommendation'
  },
  recommended: {
    type: 'success',
    message: 'Buy Recommended'
  },
  hold: {
    type: 'info',
    message: 'Hold Recommended'
  },
  sell: {
    type: 'error',
    message: 'Sell Recommendation'
  },
  force: {
    type: 'error',
    message: 'Strong Sell Recommendation'
  }
}

export { chartLabelOptions, type ChartLabelOptions, type ChartLabelType, type ChartLabel }
