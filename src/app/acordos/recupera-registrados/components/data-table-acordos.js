import Paper from '@material-ui/core/Paper'
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

const stylesHead = theme => ({
  headStyle: {
    fontFamily: 'sans-serif',
    fontSize: '12px',
    fontWeight: 'bold',
    borderBottom: '2px solid #D6D6D6'
  }
})

class DataTableHistoricoHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property)
  }

  render () {
    const { classes, dataHead } = this.props
    return (
      <TableHead>
        <TableRow>
          {dataHead.map(
            row => (
              <TableCell
                className={classes.headStyle}
                key={row.id}
                align={'center'}
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

const DataTableHistoricoHeadComponent = withStyles(stylesHead, {
  withTheme: true
})(DataTableHistoricoHead)

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

class DataTableHistorico extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    selected: [],
    data: this.props.data,
    page: 0,
    rowsPerPage: 5,
    open: [],
    openDialog: false,
    openModalRemessaAnalitico: false,
    contas: []
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
    const { classes, dataHead } = this.props
    const { data, order, orderBy, selected, rowsPerPage, page, contas } = this.state
    return (
      <Fragment>
        <MuiThemeProvider theme={muiDatatableTheme}>
          <Paper className={classes.root}>
            <div className={classes.tableWrapper}>
              <Table className={classes.table} aria-labelledby='tableTitle'>
                <DataTableHistoricoHeadComponent
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
                            <TableCell className={classes.cellRowStyle} align='center'>
                              {item.dt_retorno === null ? '-' : item.dt_retorno }
                            </TableCell>
                            <TableCell className={classes.cellRowStyle} align='center'>
                              {item.dt_acordo}
                            </TableCell>
                            <TableCell className={classes.cellRowStyle} align='center'>
                              {item.dt_registro}
                            </TableCell>
                            <TableCell className={classes.cellRowStyle} align='center'>
                              {item.vc_entrada}
                            </TableCell>
                            <TableCell className={classes.cellRowStyle} align='center'>
                              {item.id_conta}
                            </TableCell>
                            <TableCell className={classes.cellRowStyle} align='center'>
                              {item.id_acordo}
                            </TableCell>
                            <TableCell className={classes.cellRowStyle} align='center'>
                              {item.nu_nosso_numero}
                            </TableCell>
                            <TableCell className={classes.cellRowStyle} align='center'>
                              {item.nu_conta_corrente}
                            </TableCell>
                            <TableCell className={classes.cellRowStyle} align='center'>
                              {item.qt_parcelas}
                            </TableCell>
                            <TableCell className={classes.cellRowStyle} align='center'>
                              {item.nu_parcela}
                            </TableCell>
                            <TableCell className={classes.cellRowStyle} align='center'>
                              {item.ds_produto}
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

DataTableHistorico.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(DataTableHistorico)
