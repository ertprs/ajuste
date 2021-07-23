import Paper from '@material-ui/core/Paper'
import { createMuiTheme, withStyles } from '@material-ui/core/styles'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import PropTypes from 'prop-types'
import React from 'react'
import TablePaginationActions from '../../../../components/table/TablePaginationAction'
import green from '@material-ui/core/colors/green'
import LinearProgress from '@material-ui/core/LinearProgress'
import IconButton from '../../../../components/buttons/IconButton'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import Grid from '@material-ui/core/Grid'
import CustomizedTooltips from './CustomizedTooltips'

function desc (a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function stableSort (array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map(el => el[0])
}

function getSorting (order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy)
}

const rows = [
  {
    id: 'nome',
    numeric: false,
    disablePadding: false,
    label: 'NOME'
  },
  {
    id: 'cpf',
    numeric: true,
    disablePadding: false,
    label: 'CPF'
  },
  {
    id: 'numero_operacao',
    numeric: true,
    disablePadding: false,
    label: 'NUMERO OPERACAO'
  },
  {
    id: 'motivo_1',
    numeric: false,
    disablePadding: false,
    label: 'MOTIVO 1'
  },
  {
    id: 'motivo_2',
    numeric: false,
    disablePadding: false,
    label: 'MOTIVO 2'
  },
  {
    id: 'outros',
    numeric: false,
    disablePadding: false,
    label: 'OUTROS'
  }
]

const stylesHead = theme => ({
  headStyle: {
    fontFamily: 'sans-serif',
    fontSize: '12px',
    fontWeight: 'bold',
    borderBottom: '2px solid #D6D6D6'
  }
})

class DataTableAnalitcoHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property)
  }

  render () {
    const { classes } = this.props

    return (
      <TableHead>
        <TableRow>
          {rows.map(
            row => (
              <TableCell
                className={classes.headStyle}
                key={row.id}
                align={'center'}
                padding={row.disablePadding ? 'none' : 'default'}
              >
                {row.label.toUpperCase()}
              </TableCell>
            ),
            this
          )}
        </TableRow>
      </TableHead>
    )
  }
}

DataTableAnalitcoHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
}
const DataTableAnalitcoHeadComponent = withStyles(stylesHead, {
  withTheme: true
})(DataTableAnalitcoHead)

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    padding: '10px',
    marginBottom: '10px'
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
  rowStatus: {
    'color': '#008B45'
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
    marginLeft: `${rows.length * 30}%`,
    marginTop: '20px'
  },
  innerLoad: {
    display: 'flex',
    marginLeft: `${rows.length * 10}%`
  }
})

const muiDatatableTheme = createMuiTheme({
  palette: {
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
        // whiteSpace: 'nowrap',
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
    MuiToolbar: {
      root: {
        // override no root do componente
        paddingleft: 0
      },
      gutters: {
        paddingleft: 0
      }
    }
  }
})

class DataTableHistorico extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    selected: [],
    data: this.props.data,
    page: 0,
    rowsPerPage: 5
  }

  componentWillReceiveProps ({ data }) {
    this.setState({ ...this.state, data })
  }

  openCloseExpand (cedente) {
    let { open } = this.state
    if (open.includes(cedente)) {
      open = open.filter(row => row !== cedente)
    } else {
      open.push(cedente)
    }
    this.setState({ open })
  }

  handleRequestSort = (event, property) => {
    const orderBy = property
    let order = 'desc'

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }

    this.setState({ order, orderBy })
  }

  handleSelectAllClick = cedentes => event => {
    if (event.target.checked) {
      this.setState(
        {
          selected: cedentes.map((item, index) => index)
        },
        () => this.props.updateCedentesCsv(cedentes)
      )
      return
    }
    this.setState({ selected: [] }, () => this.props.updateCedentesCsv([]))
  }

  handleChangePage = (event, page) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value })
  }

  isSelected = id => this.state.selected.indexOf(id) !== -1

  render () {
    const { classes, innerLoading, dates } = this.props
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state

    return (
      <MuiThemeProvider theme={muiDatatableTheme}>
        <Paper className={classes.root}>
          <Table className={classes.table} aria-labelledby='tableTitle'>
            <DataTableAnalitcoHeadComponent
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {!innerLoading && data.length === 0 ? (
                <span className={classes.empytyTable}>NENHUM REGISTRO ENCONTRADO</span>
              ) : (
                stableSort(data, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(item => {
                    const isSelected = this.isSelected(item.id)
                    return (
                      <TableRow
                        className={classes.tableBodyRow}
                        hover
                        role='checkbox'
                        aria-checked={isSelected}
                        tabIndex={-1}
                        key={Math.random()}
                      >
                        <TableCell className={classes.cellRowStyle} align='center'>
                          {item.nome}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='center'>
                          {item.cpf}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='center'>
                          {item.numero_operacao}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='center'>
                          {item.motivo_1 === null || item.motivo_1 === '' ? '-' : (
                            <CustomizedTooltips item={[item.motivo_1]} />
                          )}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='center'>
                          {item.motivo_2 === null || item.motivo_2 === '' ? '-' : (
                            <CustomizedTooltips item={[item.motivo_2]} />
                          )}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='center'>
                          {item.outros === null || item.outros.replace(/\s+/g, '') === '-' ? '-' : (
                            <CustomizedTooltips item={[item.outros]} />
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })
              )}
            </TableBody>
          </Table>
          {innerLoading && <LinearProgress /> }
          <TablePaginationActions
            rowsPerPageOptions={[5, 10, 15, 20, 50, 100]}
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            labelRowsPerPage={'Linhas Por Página'}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>
        <Grid container direction='column' justify='space-around' alignItems='flex-end'>
          <IconButton
            onClick={() => this.props.history.push(
              '/app/bancarizacao/historico-ccbs',
              {
                date: dates
              }
            )}
            className={classes.button}
            text={'Voltar'}
            icon={<ArrowBackIcon className={classes.rightIcon} />}
          />
        </Grid>
      </MuiThemeProvider>
    )
  }
}

DataTableHistorico.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(DataTableHistorico)
