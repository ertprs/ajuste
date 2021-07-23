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
import Loading from '../../../../../components/loading'
import TablePaginationActions from '../../../../../components/table/TablePaginationAction'
import IconDetails from './IconDetails'

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
            Data Vencimento
          </TableCell>

          <TableCell
            className={classes.headStyle}
            align={'left'}
          >
            QT Faturamento
          </TableCell>

          <TableCell
            className={classes.headStyle}
            align={'left'}
          >
            VL Faturado
          </TableCell>

          <TableCell
            className={classes.headStyle}
            align={'left'}
          >
            VL Transações
          </TableCell>

          <TableCell
            className={classes.headStyle}
            align={'left'}
          >
            Verificação
          </TableCell>
          <TableCell
            className={classes.headStyle}
            align={'left'}
          >
            Blocos
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
  },
  emptyValue: {
    display: 'flex',
    width: '50%',
    justifyContent: 'center'
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
    orderBy: 'dt_corte',
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

  prettyNumber = number => {
    return parseFloat(number).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  render () {
    const { classes, innerLoading, dataHead, searchIsDone } = this.props
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state
    return (
      <MuiThemeProvider theme={muiDatatableTheme}>
        <Paper className={classes.root}>
          {innerLoading && <Loading />}
          {!innerLoading &&
            <Table className={classes.table} aria-labelledby='tableTitle'>
              <DataTableTransacoesMesHeadComponent
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                rowCount={data.length}
                dataHead={dataHead}
              />
              <TableBody>
                {searchIsDone && data.length === 0 &&
                <span className={classes.empytyTable}>NENHUM REGISTRO ENCONTRADO</span>}
                {searchIsDone && data.length > 0 &&
                  data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(item => {
                      return (
                        <TableRow
                          hover
                          tabIndex={-1}
                          key={Math.random()}
                        >
                          <TableCell className={classes.cellRowStyle} align='left'>
                            {item.dt_corte}
                          </TableCell>
                          <TableCell className={classes.cellRowStyle} align='left'>
                            {item.dt_vencimento}
                          </TableCell>
                          <TableCell className={classes.cellRowStyle} align='left'>
                            {item.qt_faturamento}
                          </TableCell>
                          <TableCell className={classes.cellRowStyle} align='left'>
                            {item.vl_faturado && this.prettyNumber(item.vl_faturado)}
                          </TableCell>
                          <TableCell className={classes.cellRowStyle} align='left'>
                            <div className={classes.emptyValue}>-</div>
                          </TableCell>
                          <TableCell className={classes.cellRowStyle} align='left'>
                            <div className={classes.emptyValue}>-</div>
                          </TableCell>
                          <TableCell className={classes.cellRowStyle} align='left'>
                            {item.dt_corte && <IconDetails onClick={() => this.props.onForward(item)} />}
                          </TableCell>
                        </TableRow>
                      )
                    })
                }
              </TableBody>
            </Table>
          }
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
