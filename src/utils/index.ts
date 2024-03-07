import moment from 'moment'

const ratio = (current: number, init: number): number => {
  return Number((((current - init) / init) * 100).toFixed(2))
}

const removeDuplicatesByKey = <T>(arr: T[], key: string): T[] => {
  const unique: Record<string, boolean> = {}
  return arr.reduce((result: T[], obj: T) => {
    const keyValue = obj[key as keyof T] as string
    if (!unique[keyValue]) {
      unique[keyValue] = true
      result.push(obj)
    }
    return result
  }, [])
}

const formatVND = (number: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number)
}

const convertToDecimal = (value: string | number, decimal = 2): number => {
  return Number(Number(value).toFixed(2))
}

const countDays = (startDate: string, endDate = moment().toISOString()): number => {
  let start = moment(startDate).utcOffset(420).startOf('day')
  const end = moment(endDate).utcOffset(420).startOf('day')

  let diffDays = 0

  const isAfternoon = Number(moment(endDate).format('HH')) >= 12 ? 0.5 : 0

  if (start.isSame(end)) {
    return isAfternoon
  }

  while (start.isBefore(end)) {
    if (start.day() !== 0 && start.day() !== 6) {
      diffDays++
    }
    start = start.add(1, 'days')
  }

  return diffDays + isAfternoon
}

export { formatVND, removeDuplicatesByKey, ratio, convertToDecimal, countDays }
