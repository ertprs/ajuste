import Paper from '@material-ui/core/Paper'
import { createMuiTheme, withStyles } from '@material-ui/core/styles'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
// import IconButton from '@material-ui/core/IconButton'
import TableRow from '@material-ui/core/TableRow'
import PropTypes from 'prop-types'
import React from 'react'
import Loading from '../../../../components/loading'
// import TablePaginationActions from '../../../../components/table/TablePaginationAction'
// import CustomizedTooltips from './CustomizedTooltips'
// import Grid from '@material-ui/core/Grid'
// import Typography from '@material-ui/core/Typography'

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
    const { classes } = this.props
    return (
      <TableHead>
        <TableRow>
          <TableCell className={classes.headStyle} align="right" colSpan={2}></TableCell>
          <TableCell className={classes.headStyle} align="right"></TableCell>
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
    padding: '10px',
    display: 'flex',
    justifyContent: 'center'
  },
  paper: {
    width: '60%',
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
  cellRowStyleTotal: {
    fontFamily: 'sans-serif',
    fontSize: '13px',
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 0.8)'
  },
  cellRowStyleNegative: {
    fontFamily: 'sans-serif',
    fontSize: '13px',
    fontWeight: 'bold',
    color: 'rgba(240, 68, 34, 0.74)'
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

  totalDolar = (data) => {
    return data['liquidacao_dolar'] + data['deposito_dolar'] + data['anterior_dolar'] + data['credito_dolar']
  }

  totalReal = (data) => {
    return data['liquidacao_real'] + data['deposito_real'] + data['anterior_real'] + data['credito_real']
  }

  totalComVariacao = (real) => {
    return real + this.props.variacao
  }

  render () {
    const { classes, dataHead, isComplete, innerLoading } = this.props
    const { data, order, orderBy, selected } = this.state

    return (
      <MuiThemeProvider theme={muiDatatableTheme}>
        <div className={classes.root}>
          { innerLoading ? <Loading/> : data === null || data.length === 0
            ? <span className={classes.empytyTable}>PERÍODO NÃO ENCONTRADO</span>
            : <Paper className={classes.paper}>
              <Table className={classes.table} aria-labelledby='tableTitle'>
                <DataTableHistoricoHeadComponent
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  dataHead={dataHead}
                />
                <TableBody>
                  <TableRow
                    className={classes.tableBodyRow}
                    hover
                    role='checkbox'
                    tabIndex={-1}
                    key={Math.random()}
                  >
                    <TableCell className={classes.cellRowStyle} >
                      SOMA DAS LIQUIDAÇÕES DOS 90 DIAS
                    </TableCell>

                    <TableCell className={classes.cellRowStyle} align='right'>
                      {this.prettyNumber(data['liquidacao'])}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    className={classes.tableBodyRow}
                    hover
                    role='checkbox'
                    tabIndex={-1}
                    key={Math.random()}
                  >
                    <TableCell className={classes.cellRowStyle} >
                      DATA BASE
                    </TableCell>

                    <TableCell className={classes.cellRowStyle} align='right'>
                      {data['dt_arquivo']}
                    </TableCell>
                  </TableRow>

                  <TableRow
                    className={classes.tableBodyRow}
                    hover
                    role='checkbox'
                    tabIndex={-1}
                    key={Math.random()}
                  >
                    <TableCell className={classes.cellRowStyle} >
                      DATA BASE + 27
                    </TableCell>
                    <TableCell className={classes.cellRowStyle} align='right'>
                      {data['dt_arquivo_27']}
                    </TableCell>
                  </TableRow>

                  <TableRow
                    className={classes.tableBodyRow}
                    hover
                    role='checkbox'
                    tabIndex={-1}
                    key={Math.random()}
                  >
                    <TableCell className={classes.cellRowStyle} >
                      DATA BASE - 89 DIAS
                    </TableCell>
                    <TableCell className={classes.cellRowStyle} align='right'>
                      {data['dt_arquivo_90']}
                    </TableCell>
                  </TableRow>

                  <TableRow
                    className={classes.tableBodyRow}
                    hover
                    role='checkbox'
                    tabIndex={-1}
                    key={Math.random()}
                  >
                    <TableCell className={classes.cellRowStyle} >
                      MÉDIA DIÁRIA DAS LIQUIDAÇÕES
                    </TableCell>
                    <TableCell className={classes.cellRowStyle} align='right'>
                      {this.prettyNumber(data['media_diaria'])}
                    </TableCell>
                  </TableRow>

                  <TableRow
                    className={classes.tableBodyRow}
                    hover
                    role='checkbox'
                    tabIndex={-1}
                    key={Math.random()}
                  >
                    <TableCell className={classes.cellRowStyle} >
                    MÉDIA DIÁRIA X PROJEÇÃO FUTURA
                    </TableCell>
                    <TableCell className={classes.cellRowStyle} align='right'>
                      {this.prettyNumber(data['media_projecao'])}
                    </TableCell>
                  </TableRow>

                  <TableRow
                    className={classes.tableBodyRow}
                    hover
                    role='checkbox'
                    tabIndex={-1}
                    key={Math.random()}
                  >
                    <TableCell className={classes.cellRowStyle} >
                    DÓLAR
                    </TableCell>
                    <TableCell className={classes.cellRowStyle} align='right'>
                      {this.prettyNumber(data['dolar'])}
                    </TableCell>
                  </TableRow>

                  <TableRow
                    className={classes.tableBodyRow}
                    hover
                    role='checkbox'
                    tabIndex={-1}
                    key={Math.random()}
                  >
                    <TableCell className={classes.cellRowStyle} >
                    MÉDIA DIÁRIA X PROJEÇÃO FUTURA EM DÓLAR
                    </TableCell>
                    <TableCell className={classes.cellRowStyle} align='right'>
                      {this.prettyNumber(data['media_projecao_dolar'])}
                    </TableCell>
                  </TableRow>

                  {isComplete ? <>
                  <TableRow>
                    <TableCell className={classes.cellRowStyleTotal} align='left'>
                        VARIAÇÃO
                    </TableCell>
                    <TableCell className={classes.cellRowStyleTotal} align='right' colSpan={2}>
                      {this.prettyNumber(this.props.variacao)}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className={classes.cellRowStyleTotal} align='left'>
                      SALDO FINAL
                    </TableCell>
                    <TableCell className={classes.cellRowStyleTotal} align='right' colSpan={2}>
                      {this.prettyNumber(this.totalComVariacao(this.totalReal(data)))}
                    </TableCell>
                  </TableRow> </> : null }
                </TableBody>
              </Table>
            </Paper> }
        </div>
      </MuiThemeProvider>
    )
  }
}

DataTableHistorico.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(DataTableHistorico)
