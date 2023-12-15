export const ratio = (current: number, init: number): number => {
  return Number((((current - init) / init) * 100).toFixed(2))
}
