import { withStyles } from '@material-ui/core/styles'
import React, { Fragment, useState, useEffect } from 'react'
import TitlePage from '../../../../components/title'
import Snackbar from '../../../../components/snackbar'
import { HistoricoTitle, HistoricoBlocos } from './components/ExpandedPanel'
import Api from '../../../../services/Api'
import IconButton from '../../../../components/buttons/IconButton'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { orderByDateArray, orderByDateObject, prettyNumber } from './utils/utils'
import Loading from '../../../../components/loading'
import PanelSintetico from './components/PanelSintetico'
import { Container } from './components/Styled'

const styles = theme => ({
  root: {
    width: '100%',
    padding: '40px'
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

function FaturamentoHistoricoBloco (props) {
  const [request, setRequest] = useState({ loading: false, error: false, message: '' })
  const [values, setValues] = useState(undefined)
  const [data, setData] = useState({
    dates: [],
    blocos: []
  })
  // const [test, setTest] = useState(null)
  const [snackbar, setSnackbar] = useState({
    open: false,
    variant: '',
    message: ''
  })

  useEffect(() => {
    setValues({ ...props.history.location.state })
    console.log('buscando na api')
    requestService()
  }, [])

  const filterDate = (apidata) => {
    const titles = orderByDateArray('asc', apidata.dates)
    console.log('Dados da api:')
    titles.push('Previsão')
    titles.push('Diferença Absoluta')
    titles.push('Diferença%')
    const blocos = apidata.agrupamentos.map(bloco => {
      let total = orderByDateObject('asc', bloco.total, 'date')
      total = total.map(value => value.total)
      let grupo = bloco.blocos.map(transacao => {
        let totalTransacao = orderByDateObject('asc', transacao.total, 'date')
        totalTransacao = totalTransacao.map(value => value.total)
        return {
          ...transacao, total: totalTransacao
        }
      })
      return { ...bloco, blocos: grupo, total }
    })
    setData({
      dates: ['Blocos - Transações', ...titles],
      blocos: blocos
    })
  }

  const requestService = async () => {
    const idHistorico = props.history.location.state.id_historico
    setRequest({ loading: true, error: false, message: '' })
    try {
      const resultado = await Api.get(`faturamento/get_historico_analitico?id_historico=${idHistorico}`)
      filterDate(resultado.data)
      setRequest({ ...request, loading: false })
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
    if (reason === 'clickaway') {
      return
    }
    setSnackbar({ ...snackbar, open: false })
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
      <TitlePage text={'Transações por Bloco'} />
      <Container>
        {values &&
        <PanelSintetico
          corte={values.dt_corte}
          vencimento={values.dt_vencimento}
          vlFaturado={prettyNumber(values.vl_faturado)}
          extratado={values.qt_faturamento} />}
        <IconButton
          onClick={() => props.history.goBack()}
          className={[classes.button, classes.back]}
          text={'Voltar'}
          icon={<ArrowBackIcon className={classes.rightIcon} />}
        />
        {request.loading && <Loading />}
        {!request.loading && !request.error &&
      <>
        {data.dates && data.dates.length > 0 && <div><header id={'myHeader'} className={classes.header}><HistoricoTitle titles={data.dates}/></header></div>}
        {data.blocos.map((bloco, index) => {
          const titles = [bloco.title, ...bloco.total, bloco.previsao, bloco.diferenca_abs, bloco.diferenca.toFixed(3)]
          return <HistoricoBlocos key={`${index}-${bloco.title}`} titles={titles} values={bloco.blocos} />
        })}
        </>
        }
      </Container>
    </Fragment>
  )
}

export default withStyles(styles)(FaturamentoHistoricoBloco)
