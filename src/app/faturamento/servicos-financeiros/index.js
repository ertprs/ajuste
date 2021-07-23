import { withStyles } from '@material-ui/core/styles'
import React, { Fragment, useState, useEffect } from 'react'
import TitlePage from '../../../components/title'
import Snackbar from '../../../components/snackbar'
import Loading from '../../../components/loading'
import Api from '../../../services/Api'
import FilterData from './components/FilterData'
import { ExpandedPanel, PanelTitle } from './components/ExpandedPanel'
import { Container } from './components/Styled'

const styles = theme => ({
  root: {
    width: '100%',
    padding: '40px'
  },
  filterContainer: {
    [theme.breakpoints.up(960 + theme.spacing.unit * 2 * 2)]: {
      marginLeft: theme.spacing.unit * 2,
      marginRight: 'auto',
      marginTop: theme.spacing.unit * 0
    }
  },
  heading: {
    fontSize: theme.typography.pxToRem(15)
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20
  },
  details: {
    alignItems: 'center'
  },
  column: {
    flexBasis: '33.33%'
  },
  back: {
    margin: '30px 0px'
  }
})

const titles = ['Serviços por Data', 'Extratados', 'Previstos', '% Precisão', '% Erro']

const datesInitial = {
  dataInicial: '',
  dataFinal: ''
}

function ServicosFinanceiros (props) {
  const [request, setRequest] = useState({ loading: false, error: false, message: '' })
  const [dates, setDates] = useState({ ...datesInitial })
  const [services, setServices] = useState([])

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

  const requestService = async ({ dataInicial = '', dataFinal = '', last = undefined }) => {
    const params = last ? `last=${last}` : `data_inicial=${dataInicial}&data_final=${dataFinal}`

    setRequest({ loading: true, error: false, message: '' })
    try {
      const resultado = await Api.get(`faturamento/get_servicos_financeiros?${params}`)
      setRequest({ ...request, loading: false })
      setServices(resultado.data)
    } catch (error) {
      setRequest({ loading: false, error: true, message: 'Ocorreu um erro ao buscar os dados' })
      setSnackbar({
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Ocorreu um erro ao buscar os dados'
        }
      })
    }
  }

  const closeAlertSnack = (event, reason) => {
    setRequest()
    if (reason === 'clickaway') {
      return
    }
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <Fragment>
      <Snackbar
        onClose={closeAlertSnack}
        open={snackbar.open}
        variant={snackbar.variant}
        message={snackbar.message}
      />
      <TitlePage text={'Serviços Financeiros'} />
      <Container>
        <FilterData
          filter={dates}
          handleClick={handleClick}
          cleanFilters={cleanFilters}
          onChangeDates={onChangeInputValueDates}
        />
        {!request.loading && services.length > 0 && <PanelTitle titles={titles} />}
        {!request.loading && services.length > 0 && services.map((service, index) => {
          const totais = [`Total em ${service.vencimento}`, service.extratados, service.previstos, service.precisao, service.erro]
          return <ExpandedPanel key={`${service.id}`} titles={totais} values={service.servicos} />
        })}
        {request.loading && <Loading />}
      </Container>
    </Fragment>
  )
}

export default withStyles(styles)(ServicosFinanceiros)
