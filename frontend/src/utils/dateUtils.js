export const MS_PER_DAY = 1000 * 60 * 60 * 24

export const getCurrentDate = () => {
  return new Date()
  // return new Date(new Date().getTime() + 4 * MS_PER_DAY)
}

export const isToday = (timestamp) => {
  const today = getCurrentDate().setHours(0, 0, 0, 0)
  const thatDay = new Date(timestamp).setHours(0, 0, 0, 0)

  return today === thatDay
}

export const dateDiffInDays = (a, b) => {
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())

  return Math.floor((utc2 - utc1) / MS_PER_DAY)
}
