import Paper from '@material-ui/core/Paper'
import Checkbox from '@material-ui/core/Checkbox'
import { createMuiTheme, withStyles } from '@material-ui/core/styles'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import TablePaginationActions from '../../../../components/table/TablePaginationAction'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import { green } from '@material-ui/core/colors'
import Grid from '@material-ui/core/Grid'
import FilterData from './FilterData'
import exportCSVFile from '../../../../util/exportCSVFile'
import Snackbar from '../../../../components/snackbar'
import Api from '../../../../services/Api'

const stylesHead = theme => ({
  headStyle: {
    fontFamily: 'sans-serif',
    fontSize: '12px',
    fontWeight: 'bold',
    borderBottom: '2px solid #D6D6D6'
  }
})

class DataTableHistoricoAnaliticoHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property)
  }

  render () {
    const { classes, dataHead, numSelected, onSelectAllClick, rowCount } = this.props
    return (
      <TableHead>
        <TableRow>
          <TableCell className={classes.headStyle} padding='checkbox'>
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {dataHead.map(
            row => (
              <TableCell
                className={classes.headStyle}
                key={row.id}
                align={'left'}
              >
                {row.replace('_', ' ').replace('_', ' ').toUpperCase()}
              </TableCell>
            ),
            this
          )}
        </TableRow>
      </TableHead>
    )
  }
}

const DataTableHistoricoAnaliticoHeadComponent = withStyles(stylesHead, {
  withTheme: true
})(DataTableHistoricoAnaliticoHead)

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    padding: '10px'
  },
  table: {
    maxWidth: '100%',
    minWidth: '10%',
    overflowX: 'auto',
    padding: '10px'
  },
  select: {
    paddingRight: 25
  },
  tableBodyRow: {
    borderBottom: '1px solid #D6D6D6'
  },
  cellRowStyle: {
    fontFamily: 'sans-serif',
    fontSize: '13px',
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 0.54)'
  },
  sucesso: {
    color: '#008B45'
  },
  falha: {
    color: '#d62133'
  },
  textInsideTable: {
    fontSize: '11px'
  },
  empytyTable: {
    display: 'flex',
    textAlign: 'center',
    fontFamily: 'sans-serif',
    fontSize: '13px',
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 0.54)',
    marginLeft: `${5 * 30}%`,
    marginTop: '20px'
  },
  innerLoad: {
    display: 'flex',
    marginLeft: `${5 * 10}%`
  }
})

const muiDatatableTheme = createMuiTheme({
  palette: {
    secondary: {
      main: green[600]
    },
    primary: green
  },
  overrides: {
    MUIDataTable: {
      responsiveScroll: {
        maxHeight: 'none',
        webkitScrollbarThumb: 'active'
      }
    },
    MuiTableCell: {
      root: {
        padding: '0px 0px 0px 0px',
        whiteSpace: 'nowrap',
        position: 'relative',
        zIndex: 0,
        backgroundColor: '#fff',
        borderBottom: 0
      }
    },
    MuiTableRow: {
      footer: {
        height: 40
      }
    },
    select: {
      paddingRight: '50px',
      width: 200
    },
    MuiIconButton: {
      root: {
        // override no root do componente
        padding: 6,
        borderRadius: 10
      }
    },
    MuiButton: {
      raisedPrimary: {
        color: 'white'
      }
    }
  }
})

class DataTableHistoricoAnalitico extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    selected: [],
    data: this.props.data,
    page: 0,
    rowsPerPage: 5,
    open: [],
    snackbar: {
      open: false,
      variant: '',
      message: ''
    },
    contas: [],
    gerado: true
  }

  handleChangePage = (event, page) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value })
  }

  componentWillReceiveProps ({ data }) {
    this.setState({ ...this.state, data })
  }

  componentDidMount () {
    this.setState({
      contas: Array.from(new Set(this.state.data.map(item => ({ 'conta': item.numero_conta, 'dt_ocorrencia': item.dt_ocorrencia }))))
    })
  }

  stableSort = (array, cmp) => {
    const stabilizedThis = array.map((el, index) => [el, index])
    stabilizedThis.sort((a, b) => {
      const order = cmp(a[0], b[0])
      if (order !== 0) return order
      return a[1] - b[1]
    })
    return stabilizedThis.map(el => el[0])
  }
  desc = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1
    }
    if (b[orderBy] > a[orderBy]) {
      return 1
    }
    return 0
  }

  getSorting = (order, orderBy) => {
    return order === 'desc' ? (a, b) => this.desc(a, b, orderBy) : (a, b) => -this.desc(a, b, orderBy)
  }

  handleClick = (event, id) => {
    const { selected } = this.state
    const selectedIndex = selected.indexOf(id)

    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }
    this.setState({ selected: newSelected })
  }

  handleSelectAllClick = contas => event => {
    if (event.target.checked) {
      this.setState(
        {
          selected: contas.map((item, index) => (index))
        }
      )
      return
    }
    this.setState({ selected: [] })
  }

  onClose = (event, reason) => {
    if (reason === 'clickaway') {
      this.setState({ snackbar: { ...this.state.snackbar, open: false } })
    }
    this.setState({ snackbar: { ...this.state.snackbar, open: false } })
  }

  prettyNumber = number => {
    return parseFloat(number).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  FormatdateApi = dateStr => {
    let dateList = dateStr.match(/\d+/g)
    return `${dateList[2]}-${dateList[1]}-${dateList[0]}`
  }

  isSelected = id => this.state.selected.indexOf(id) !== -1

  gerarRelatorio = async () => {
    this.setState({ gerado: false })
    var dataRelatorio = []
    var relatorio = []
    const { rowsPerPage, page } = this.state
    this.state.selected.map(item => dataRelatorio.push(this.state.data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[item]))
    // eslint-disable-next-line array-callback-return
    await Promise.all(dataRelatorio.map(async (item) => {
      const resultado = await Api.get(`relatorio-tarifa-por-conta-ocorrencia?conta=${item.numero_conta}&data_ocorrencia=${this.FormatdateApi(item.dt_ocorrencia)}&ocorrencia=${item.ocorrencia}`)
      // eslint-disable-next-line array-callback-return
      resultado.data.map(item => { relatorio.push(item) })
    }))
    if (relatorio.length > 0) {
      this.setState({ gerado: true })
      exportCSVFile(relatorio, `relatorio_tarifas`, [])
      this.setState({
        snackbar: {
          open: true,
          variant: 'success',
          message: 'Relatório gerado'
        }
      })
    } else {
      this.setState({ gerado: true })
      this.setState({
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Erro interno'
        }
      })
    }
  }

  render () {
    const { classes, dataHead } = this.props
    const { data, order, orderBy, selected, rowsPerPage, page, contas, gerado } = this.state
    return (
      <Fragment>
        <Snackbar
          onClose={this.onClose}
          open={this.state.snackbar.open}
          variant={this.state.snackbar.variant}
          message={this.state.snackbar.message}
        />
        <MuiThemeProvider theme={muiDatatableTheme}>
          <Grid container direction='row' justify='flex-end' alignItems='baseline'>
            <FilterData gerarRelatorio={() => this.gerarRelatorio()} disabled={selected.length <= 0} gerado={gerado} />
          </Grid>
          <Paper className={classes.root}>
            <div className={classes.tableWrapper}>
              <Table className={classes.table} aria-labelledby='tableTitle'>
                <DataTableHistoricoAnaliticoHeadComponent
                  dataHead={dataHead}
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={this.handleSelectAllClick(contas)}
                  onRequestSort={this.handleRequestSort}
                  rowCount={contas.length}
                />
                <TableBody>
                  {this.stableSort(data, this.getSorting(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item, index) => {
                      const isSelected = this.isSelected(index)
                      return (
                        <Fragment key={index}>
                          <TableRow
                            className={classes.tableBodyRow}
                            hover
                            role='checkbox'
                            aria-checked={isSelected}
                            tabIndex={index}
                            key={index}
                          >
                            <TableCell padding='checkbox'>
                              <Checkbox
                                onClick={event => this.handleClick(event, index)}
                                checked={isSelected}
                              />
                            </TableCell>
                            <TableCell className={classes.cellRowStyle} align='left'>
                              {item.numero_conta}
                            </TableCell>
                            <TableCell className={classes.cellRowStyle} align='left'>
                              {item.dt_ocorrencia}
                            </TableCell>
                            <TableCell className={classes.cellRowStyle} align='left'>
                              {item.ocorrencia}
                            </TableCell>
                            <TableCell className={classes.cellRowStyle} align='left'>
                              {item.qtd_ocorrencia}
                            </TableCell>
                            <TableCell className={classes.cellRowStyle} align='left'>
                              {item.titulos_baixados}
                            </TableCell>
                            <TableCell className={classes.cellRowStyle} align='left'>
                              {item.empresa}
                            </TableCell>
                            <TableCell className={classes.cellRowStyle} align='left'>
                              {this.prettyNumber(item.total_ocorrencia)}
                            </TableCell>
                          </TableRow>
                        </Fragment>
                      )
                    })}
                </TableBody>
              </Table>
              <TablePaginationActions
                rowsPerPageOptions={[5, 10, 15, 20, 50, 100]}
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                labelRowsPerPage={'Linhas Por Página'}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </div>
          </Paper>
        </MuiThemeProvider>
      </Fragment>
    )
  }
}

DataTableHistoricoAnalitico.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(DataTableHistoricoAnalitico)
