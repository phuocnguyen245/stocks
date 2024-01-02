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

export { formatVND, removeDuplicatesByKey, ratio }
