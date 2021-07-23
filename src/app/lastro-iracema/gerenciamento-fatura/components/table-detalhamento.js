import Paper from '@material-ui/core/Paper'
import { createMuiTheme, withStyles } from '@material-ui/core/styles'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import PropTypes from 'prop-types'
import React from 'react'

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

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    padding: '20px'
  },
  table: {
    maxWidth: '100%',
    minWidth: '10%',
    overflowX: 'auto',
    padding: '20px'
  },
  select: {
    paddingRight: 25
  },
  tableBodyRow: {
    borderBottom: '1px solid #D6D6D6',
    textOverflow: '…',
    minWidth: '100px',
    maxWidth: '120px',
    marginRight: '30px',
    fontFamily: 'sans-serif',
    fontSize: '13px',
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 0.54)'
  },
  text: {
    fontSize: '12px',
    fontFamily: 'Helvetica',
    lineHeight: '1.6',
    letterSpacing: '0.0075em'
  },
  empytyTable: {
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    fontFamily: 'sans-serif',
    fontSize: '13px',
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 0.54)',
    marginTop: '20px',
    marginBottom: '20px'
  },
  divRowT: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    padding: '3px',
    color: '#696969'
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
        padding: '0px 20px 0px 0px',
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
    }
  }
})

class DataTableDetalhamento extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    selected: [],
    data: this.props.data,
    page: 0,
    rowsPerPage: 5,
    open: false
  }

  componentWillReceiveProps ({ data }) {
    this.setState({ ...this.state, data })
  }

  handleChangePage = (event, page) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value })
  }

  handleRequestSort = (event, property) => {
    const orderBy = property
    let order = 'desc'

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }

    this.setState({ order, orderBy })
  }

  render () {
    const { classes, data } = this.props
    const { order, orderBy, rowsPerPage, page } = this.state

    return (
      <MuiThemeProvider theme={muiDatatableTheme}>
        <Paper className={classes.root}>
          {data.length === 0 ? (
            <span className={classes.empytyTable}>NENHUM REGISTRO ENCONTRADO</span>
          ) : (
            stableSort(data, getSorting(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item, index) => {
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', margin: 'auto', width: '75%' }}>
                    <div className={classes.divRowT}>
                      <div>ID_CONTA</div>
                      <div>{item[0]}</div>
                    </div>
                    <div className={classes.divRowT}>
                      <div>DS_NOME_EMBOSSING</div>
                      <div>{item[1]}</div>
                    </div>
                    <div className={classes.divRowT}>
                      <div>DS_CARTAO</div>
                      <div>{item[2]}</div>
                    </div>
                    <div className={classes.divRowT}>
                      <div>DT_COMPRA</div>
                      <div>{item[3]}</div>
                    </div>
                    <div className={classes.divRowT}>
                      <div>VL_COMPRA</div>
                      <div>{item[4]}</div>
                    </div>
                    <div className={classes.divRowT}>
                      <div>VL_PARCELA</div>
                      <div>{item[5]}</div>
                    </div>
                    <div className={classes.divRowT}>
                      <div>NU_PARCELA</div>
                      <div>{item[6]}</div>
                    </div>
                    <div className={classes.divRowT}>
                      <div>NU_NSU_HOST</div>
                      <div>{item[7]}</div>
                    </div>
                    <div className={classes.divRowT}>
                      <div>DS_TIPO_TRANSACAO</div>
                      <div>{item[8]}</div>
                    </div>
                    <div className={classes.divRowT}>
                      <div>NU_CNPJ</div>
                      <div>{item[9]}</div>
                    </div>
                    <div className={classes.divRowT}>
                      <div>DS_RAZAO_SOCIAL</div>
                      <div>{item[10]}</div>
                    </div>
                    <div className={classes.divRowT}>
                      <div>DS_CODIGO_AUTORIZACAO</div>
                      <div>{item[11]}</div>
                    </div>
                    <div className={classes.divRowT}>
                      <div>VL_COMISSAO</div>
                      <div>{item[12]}</div>
                    </div>
                    <div className={classes.divRowT}>
                      <div>TAXA_ADMI_PARC</div>
                      <div>{item[13]}</div>
                    </div>
                    <div className={classes.divRowT}>
                      <div>TX_ADMIN_A_VISTA</div>
                      <div>{item[14]}</div>
                    </div>
                  </div>
                )
              })
          )}
        </Paper>
      </MuiThemeProvider>
    )
  }
}

DataTableDetalhamento.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(DataTableDetalhamento)
