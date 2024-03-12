import { type LabelType } from '.'
const getColor = (type: LabelType): string => {
  const hexColors = {
    success: ' #f8fff9',
    error: ' #d41834',
    warning: '#9e5718',
    primary: '#f5ecfb',
    secondary: '#D3D3D3',
    info: '#07595a'
  }
  return hexColors[type]
}

const getBgColor = (type: LabelType): string => {
  const hexColors = {
    success: 'success.main',
    error: ' #FFB6C1',
    warning: '#FFDAB9',
    primary: '#a41bfa',
    secondary: '#D3D3D3',
    info: '#1fecf0'
  }
  return hexColors[type]
}

export { getBgColor, getColor }
