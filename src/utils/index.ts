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

const convertDay = (value: Date): string =>
  `${value.getDate()}/${value.getMonth()}/${value.getFullYear()}`

const countDays = (start: string, end: string): number => {
  const startDate: Date = new Date(start)
  const endDate: Date = new Date(end)

  startDate.setUTCHours(startDate.getUTCHours())
  endDate.setUTCHours(endDate.getUTCHours())

  const hoursPerHalfDay: number = 12

  if (convertDay(startDate) === convertDay(endDate)) {
    return 0
  }

  let count: number = 0
  // eslint-disable-next-line no-unmodified-loop-condition
  while (startDate < endDate) {
    const dayOfWeek: number = startDate.getUTCDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count += 1
    }
    startDate.setUTCDate(startDate.getUTCDate() + 1)
  }

  if (endDate.getUTCHours() + 7 >= hoursPerHalfDay) {
    count += 0.5
  }

  return count
}

export { formatVND, removeDuplicatesByKey, ratio, convertToDecimal, countDays }
