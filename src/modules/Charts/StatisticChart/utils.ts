type ChartLabelType = 'strong' | 'recommended' | 'hold' | 'sell' | 'force'

interface ChartLabel {
  type: 'success' | 'info' | 'error'
  message: string
}

type ChartLabelOptions = Record<ChartLabelType, ChartLabel>

const chartLabelOptions: ChartLabelOptions = {
  strong: {
    type: 'success',
    message: 'Strong Buy '
  },
  recommended: {
    type: 'success',
    message: 'Buy '
  },
  hold: {
    type: 'info',
    message: 'Hold '
  },
  sell: {
    type: 'error',
    message: 'Sell '
  },
  force: {
    type: 'error',
    message: 'Strong Sell '
  }
}

export { chartLabelOptions, type ChartLabelOptions, type ChartLabelType, type ChartLabel }
