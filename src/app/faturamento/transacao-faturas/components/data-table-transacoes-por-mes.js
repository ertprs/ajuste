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
import Loading from '../../../../components/loading'
import TablePaginationActions from '../../../../components/table/TablePaginationAction'

const stylesHead = theme => ({
  headStyle: {
    fontFamily: 'sans-serif',
    fontSize: '12px',
    fontWeight: 'bold',
    borderBottom: '2px solid #D6D6D6'
  }
})

class DataTableTransacoesMesHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property)
  }

  render () {
    const { classes } = this.props
    return (
      <TableHead>
        <TableRow>
          <TableCell
            className={classes.headStyle}
            align={'left'}
          >
            Data corte
          </TableCell>

          <TableCell
            className={classes.headStyle}
            align={'left'}
          >
            Data vencimento
          </TableCell>

          <TableCell
            className={classes.headStyle}
            align={'left'}
          >
            DS Transação
          </TableCell>

          <TableCell
            className={classes.headStyle}
            align={'left'}
          >
            Valor
          </TableCell>

          <TableCell
            className={classes.headStyle}
            align={'left'}
          >
            NU Conta Corrente
          </TableCell>
        </TableRow>
      </TableHead>
    )
  }
}

const DataTableTransacoesMesHeadComponent = withStyles(stylesHead, {
  withTheme: true
})(DataTableTransacoesMesHead)

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

class DataTableTransacoesMes extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    selected: [],
    data: [0, 0, 1, 1],
    page: 0,
    rowsPerPage: 5,
    open: [],
    openDialog: false,
    openModalRemessaAnalitico: false
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

  render () {
    const { classes, innerLoading, dataHead } = this.props
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state
    return (
      <MuiThemeProvider theme={muiDatatableTheme}>
        <Paper className={classes.root}>
          {innerLoading ? <Loading /> : (
            <Table className={classes.table} aria-labelledby='tableTitle'>
              <DataTableTransacoesMesHeadComponent
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                rowCount={data.length}
                dataHead={dataHead}
              />
              <TableBody>
                {!innerLoading && data.length === 0 ? (
                  <span className={classes.empytyTable}>NENHUM REGISTRO ENCONTRADO</span>
                ) : (
                  this.stableSort(data, this.getSorting(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(item => {
                      return (
                        <TableRow
                          hover
                          tabIndex={-1}
                          key={Math.random()}
                        >
                          <TableCell className={classes.cellRowStyle} align='left'>
                            {item[0]}
                          </TableCell>
                          <TableCell className={classes.cellRowStyle} align='left'>
                            {item[1]}
                          </TableCell>
                          <TableCell className={classes.cellRowStyle} align='left'>
                            {item[2]}
                          </TableCell>
                          <TableCell className={classes.cellRowStyle} align='left'>
                            {item[3]}
                          </TableCell>
                          <TableCell className={classes.cellRowStyle} align='left'>
                            {item[4]}
                          </TableCell>
                        </TableRow>
                      )
                    })
                )}
              </TableBody>
            </Table>
          )}
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
      </MuiThemeProvider>
    )
  }
}

DataTableTransacoesMes.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(DataTableTransacoesMes)
