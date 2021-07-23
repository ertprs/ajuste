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
      if (line !== '') line += ';'

      line += array[i][index]
    }

    str += line + '\r\n'
  }

  return str
}

function prettyNumber (number) {
  return parseFloat(number).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).replace(',', '')
}

function exportCSVFile (ArrayObj, fileTitle, columnsExclude = [], isInternational = false) {
  if (isInternational) {
    let newArrayObj = []
    ArrayObj.map(item => {
      let obj = {
        dt_geracao: item['dt_geracao'],
        transacao: item['transacao'],
        valor_real: prettyNumber(item['valor_real']),
        comissao_real: prettyNumber(item['comissao_real']),
        valor_dolar: prettyNumber(item['valor_dolar']),
        comissao: prettyNumber(item['comissao']),
        cotacao: prettyNumber(item['cotacao']),
        valor_total_dolar: prettyNumber(item['valor_total_dolar']),
        valor_total_real: prettyNumber(item['valor_total_real'])
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

export default exportCSVFile
