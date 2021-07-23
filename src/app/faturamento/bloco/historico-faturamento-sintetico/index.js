import { withStyles } from '@material-ui/core/styles'
import React, { Fragment, useState, useEffect } from 'react'
import DataTableHistorico from './components/DataTable'
import TitlePage from '../../../../components/title'
import FilterData from './components/FilterData'
import Snackbar from '../../../../components/snackbar'
import Api from '../../../../services/Api'

const styles = theme => ({
  filterContainer: {
    [theme.breakpoints.up(960 + theme.spacing.unit * 2 * 2)]: {
      marginLeft: theme.spacing.unit * 2,
      marginRight: 'auto',
      marginTop: theme.spacing.unit * 0
    }
  },
  DataTableHistorico: {
    [theme.breakpoints.up(960 + theme.spacing.unit * 2 * 2)]: {
      marginLeft: theme.spacing.unit * 2,
      marginRight: theme.spacing.unit * 2,
      marginTop: theme.spacing.unit * 4,
      marginBottom: theme.spacing.unit * 5
    }
  },
  root: {
    height: 500,
    width: 200
  }
})

const datesInitial = {
  dataInicial: '',
  dataFinal: ''
}

function TransacaoFaturamento (props) {
  const [dates, setDates] = useState({ ...datesInitial })
  const [innerLoading, setInnerLoading] = useState(false)
  const [searchIsDone, setSearchIsDone] = useState(false)
  const [data, setData] = useState([])
  const [snackbar, setSnackbar] = useState({
    open: false,
    variant: '',
    message: ''
  })

  useEffect(() => {
    requestService({ last: 5 })
  }, [])

  const onChangeInputValueDates = e => {
    setDates({ ...dates, [e.target.name]: e.target.value || '' })
  }

  const cleanFilters = () => {
    setDates({ ...datesInitial })
  }

  const requestService = async ({ dataInicial = '', dataFinal = '', last = undefined }) => {
    const params = last ? `last=${last}` : `data_inicial=${dataInicial}&data_final=${dataFinal}`
    setInnerLoading(true)
    setSearchIsDone(false)
    try {
      const resultado = await Api.get(`faturamento/get_historico_sintetico?${params}`)
      setData(resultado.data)
      setInnerLoading(false)
      setSearchIsDone(true)
    } catch (error) {
      setInnerLoading(false)
      setSnackbar({
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Ocorreu um erro ao buscar os dados'
        }
      })
    }
  }

  const handleClick = () => {
    let { dataFinal, dataInicial } = dates

    if (!dataInicial && !dataFinal) {
      return
    } else if (dataInicial && !dataFinal) {
      dataFinal = dataInicial
    } else if (!dataInicial && dataFinal) {
      dataInicial = dataFinal
    }

    setDates({ dataInicial, dataFinal })
    dataInicial = dataInicial.split('/').reverse().join('-')
    dataFinal = dataFinal.split('/').reverse().join('-')
    requestService({ dataInicial, dataFinal })
  }

  const closeAlertSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbar({ ...snackbar, open: false })
  }

  const forwardToNextPage = (item) => {
    props.history.push(
      '/app/faturamento/historico-bloco',
      item
    )
  }

  const { classes } = props
  return (
    <Fragment>
      <Snackbar
        onClose={closeAlertSnack}
        open={snackbar.open}
        variant={snackbar.variant}
        message={snackbar.message}
      />
      <TitlePage text={'Blocos'} />
      <div className={classes.filterContainer}>
        <FilterData
          filter={dates}
          handleClick={handleClick}
          cleanFilters={cleanFilters}
          onChangeDates={onChangeInputValueDates}
        />
      </div>
      <div className={classes.DataTableHistorico}>
        <Fragment>
          <DataTableHistorico
            onForward={forwardToNextPage}
            innerLoading={innerLoading}
            data={data}
            searchIsDone={searchIsDone}
          />
        </Fragment>
      </div>
    </Fragment>
  )
}

export default withStyles(styles)(TransacaoFaturamento)
