import Paper from '@material-ui/core/Paper'
import { createMuiTheme, withStyles } from '@material-ui/core/styles'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import green from '@material-ui/core/colors/green'
import TablePaginationActions from '../../../../components/table/TablePaginationAction'

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
    id: 'CPF',
    numeric: true,
    disablePadding: false,
    label: 'CPF'
  },
  {
    id: 'NOME',
    numeric: true,
    disablePadding: false,
    label: 'NOME'
  },
  {
    id: 'TIPO',
    numeric: true,
    disablePadding: false,
    label: 'TIPO ARQUIVO'
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

class DataTableRemessaxFaturamentoHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property)
  }

  render () {
    const { order, orderBy, classes } = this.props

    return (
      <TableHead>
        <TableRow>
          {rows.map(
            row => (
              <TableCell
                className={classes.headStyle}
                key={row.id}
                align={'left'}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
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

DataTableRemessaxFaturamentoHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
}
const DataTableRemessaxFaturamentoHeadComponent = withStyles(stylesHead, {
  withTheme: true
})(DataTableRemessaxFaturamentoHead)

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3
  },
  table: {
    maxWidth: '100%',
    minWidth: '10%',
    borderCollapse: 'separate'
  },
  tableWrapper: {
    overflowX: 'auto',
    padding: '20px'
  },
  select: {
    paddingRight: 25
  },
  tableBodyRow: {
    fontFamily: 'sans-serif',
    fontSize: '12px',
    fontWeight: 'bold',
    borderBottom: '2px solid #D6D6D6',
    borderTop: '2px solid #D6D6D6'
  },
  cellRowStyle: {
    fontFamily: 'sans-serif',
    fontSize: '13px',
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 0.54)'
  }
})

const muiDatatableTheme = createMuiTheme({
  palette: {
    secondary: {
      main: green[600]
    }
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
    }
  }
})

class DataTableRemessaxFaturamento extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    selected: [],
    data: this.props.data,
    cedentes: [],
    page: 0,
    rowsPerPage: 5,
    open: [],
    openDialog: false,
    openModalRemessaAnalitico: false,
    cedentesSelect: [],
    cedente: null,
    tratativa: null
  }

  componentWillReceiveProps ({ data }) {
    this.setState({ ...this.state, data })
  }

  componentDidMount () {
    this.setState({
      cedentes: Array.from(new Set(this.state.data.map(item => item.CONTA)))
    })
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

    // this.setState({ selected: newSelected })
    let cedentesCsv = this.state.data
      .filter((item, index) => newSelected.includes(index))
      .map(item => item.CONTA)
    // async function to update csv data
    this.setState({ selected: newSelected }, () => this.props.updateCedentesCsv(cedentesCsv))
  }

  handleChangePage = (event, page) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value })
  }

  openCloseDialog (cedente) {
    this.setState(
      {
        cedente
      },
      () => this.setState({ openDialog: !this.state.openDialog })
    )
  }

  openCloseModalRemessaAnalitico (cedente, tratativa) {
    this.setState(
      {
        cedente
      },
      () =>
        this.setState({
          openModalRemessaAnalitico: !this.state.openModalRemessaAnalitico
        })
    )
  }

  // isSelected = id => this.state.selected.indexOf(id) !== -1

  render () {
    const { classes } = this.props
    const { data, order, orderBy, rowsPerPage, page } = this.state

    return (
      <MuiThemeProvider theme={muiDatatableTheme}>
        <Paper className={classes.root}>
          <div className={classes.tableWrapper}>
            <Table className={classes.table} aria-labelledby='tableTitle'>
              <DataTableRemessaxFaturamentoHeadComponent />
              <TableBody>
                {stableSort(data, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => {
                    // const isSelected = this.isSelected(index)
                    return (
                      <Fragment key={index}>
                        <TableRow className={classes.tableBodyRow}>
                          <TableCell className={classes.cellRowStyle} align='left'>
                            {item.CPF}
                          </TableCell>
                          <TableCell className={classes.cellRowStyle} align='left'>
                            {item.NOME}
                          </TableCell>
                          <TableCell className={classes.cellRowStyle} align='left'>
                            {item.TIPO}
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
    )
  }
}

DataTableRemessaxFaturamento.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(DataTableRemessaxFaturamento)
