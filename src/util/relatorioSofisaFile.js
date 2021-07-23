function convertToCSV (JsonArray) {
  const csv = []
  const arrayKeys = Object.keys(JsonArray[0])
  csv.push(arrayKeys)

  JsonArray.map(obj => csv.push(Object.values(obj)))

  // colocar vazios nos campos null
  const array = csv.map(item => item.map(item => (item === null ? ' ' : item)))

  var str = ''

  for (var i = 0; i < array.length; i++) {
    var line = ''
    for (var index in array[i]) {
      if (line !== '') line += ','

      line += array[i][index]
    }

    str += line + '\r\n'
  }

  return str
}

// function prettyNumber (number) {
//   return parseFloat(number).toLocaleString('en-US', {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2
//   }).replace(',', '')
// }

function relatorioSofisaFile (ArrayObj, fileTitle, columnsExclude = [], isInternational = false) {
  if (isInternational) {
    let newArrayObj = []
    ArrayObj.map(item => {
      let obj = {
        id_conta: item['id_conta'],
        vl_saldo_atual: item['vl_saldo_atual'],
        vl_saldo_futuro: item['vl_saldo_futuro'],
        vl_saldo_total: item['vl_saldo_total'],
        nu_vencimento: item['nu_vencimento'],
        qt_dias_atraso: item['qt_dias_atraso']
      }
      return newArrayObj.push(obj)
    })
    ArrayObj = newArrayObj
  }

  if (columnsExclude) {
    for (var key in columnsExclude) {
      var column = columnsExclude[key]
      for (var value in ArrayObj) {
        delete ArrayObj[value][column]
      }
    }
  }
  var csv = convertToCSV(ArrayObj)

  var exportedFilenmae = fileTitle + '.csv' || 'export.csv'

  var blob = new window.Blob([csv], { type: 'text/csv;charset=utf-8;' })
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, exportedFilenmae)
  } else {
    var link = document.createElement('a')
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', exportedFilenmae)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}

export default relatorioSofisaFile
