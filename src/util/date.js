function formatDate (input) {
  if (input === null) return

  var datePart = input.match(/\d+/g)

  var year = datePart[0].substring(2)
  // get only two digits

  var month = datePart[1]

  var day = datePart[2]

  return day + '/' + month + '/' + year
}

export default formatDate
