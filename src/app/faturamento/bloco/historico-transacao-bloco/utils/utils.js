import moment from 'moment'

export function orderByDateObject (orderBy = 'asc', array = [], attr) {
  array.sort((a, b) => {
    const date1 = moment(a[attr])
    const date2 = moment(b[attr])
    if (date1 > date2) {
      return 1
    } else if (date1 < date2) {
      return -1
    } else {
      return 0
    }
  })

  return (orderBy === 'asc') ? array : array.reverse()
}

export function orderByDateArray (orderBy = 'asc', array = []) {
  array.sort((a, b) => {
    const date1 = moment(a)
    const date2 = moment(b)
    if (date1 > date2) {
      return 1
    } else if (date1 < date2) {
      return -1
    } else {
      return 0
    }
  })
  return (orderBy === 'asc') ? array : array.reverse()
}

export function prettyNumber (number) {
  if (typeof number !== 'number') return number
  return parseFloat(number).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}
