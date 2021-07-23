import FirstPageIcon from '@material-ui/icons/FirstPage'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import LastPageIcon from '@material-ui/icons/LastPage'
import IconButton from '@material-ui/core/IconButton'
import { withStyles, createMuiTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'

class TablePagination extends React.Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0)
  }

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1)
  }

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1)
  }

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1)
    )
  }

  render () {
    const {
      classes,
      count,
      page,
      rowsPerPage,
      theme,
      onChangeRowsPerPage,
      rowsPerPageOptions,
      labelRowsPerPage
    } = this.props

    return (
      <MuiThemeProvider theme={muiDatatableTheme}>
        <div className={classes.root}>
          <div style={{ flex: '1' }} />
          <div style={{ flex: '1' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  alignContent: 'center'
                }}
              >
                <IconButton
                  style={{
                    padding: 2,
                    border: '1px solid #D6D6D6',
                    borderRadius: '75%',
                    marginLeft: 5
                  }}
                  onClick={this.handleFirstPageButtonClick}
                  disabled={page === 0}
                  aria-label='Primeira Página'
                >
                  {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
                </IconButton>
                <IconButton
                  style={{
                    padding: 2,
                    border: '1px solid #D6D6D6',
                    borderRadius: '75%',
                    marginLeft: 5
                  }}
                  onClick={this.handleBackButtonClick}
                  disabled={page === 0}
                  aria-label='Página Anterior'
                >
                  {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                </IconButton>
                <IconButton
                  style={{
                    backgroundColor: '#008B45',
                    borderRadius: '75%',
                    marginLeft: 5,
                    width: 32,
                    height: 32,
                    color: '#fafafa',
                    padding: 2
                  }}
                >
                  <span style={{ fontSize: 14 }}>{page}</span>
                </IconButton>
                <IconButton
                  style={{
                    padding: 2,
                    border: '1px solid #D6D6D6',
                    borderRadius: '75%',
                    marginLeft: 5
                  }}
                  onClick={this.handleNextButtonClick}
                  disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                  aria-label='Próxima Página'
                >
                  {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                </IconButton>
                <IconButton
                  style={{
                    padding: 2,
                    border: '1px solid #D6D6D6',
                    borderRadius: '75%',
                    marginLeft: 5
                  }}
                  onClick={this.handleLastPageButtonClick}
                  disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                  aria-label='Última página'
                >
                  {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
                </IconButton>
              </div>
            </div>
          </div>
          <div style={{ flex: '1' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <span
                style={{
                  fontFamily: 'sans-serif',
                  fontSize: '13px',
                  color: 'rgba(0, 0, 0, 0.54)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  alignContent: 'center'
                }}
              >
                {labelRowsPerPage}
              </span>
              <FormControl style={{ marginLeft: 10 }}>
                <Select
                  style={{ paddingRight: -10 }}
                  value={rowsPerPage}
                  disableUnderline
                  onChange={onChangeRowsPerPage}
                  displayEmpty
                  name='rowsPerPage'
                >
                  {rowsPerPageOptions.map((item, index) => (
                    <MenuItem value={item} key={index}>
                      <span
                        style={{
                          fontFamily: 'sans-serif',
                          fontSize: '14px',
                          color: 'rgba(0, 0, 0, 0.54)'
                        }}
                      >
                        {item}
                      </span>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <span
                style={{
                  fontFamily: 'sans-serif',
                  fontSize: '14px',
                  color: 'rgba(0, 0, 0, 0.54)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  alignContent: 'center',
                  paddingLeft: 20
                }}
              >{`${count === 0 ? 0 : page * rowsPerPage + 1}-${Math.min(
                  count,
                  (page + 1) * rowsPerPage
                )} de ${count}`}</span>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

TablePagination.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired
}

const actionsStyles = theme => ({
  root: {
    color: theme.palette.text.secondary,
    display: 'flex',
    marginTop: 5
  }
})

const muiDatatableTheme = createMuiTheme({
  overrides: {
    MuiSelect: {
      select: {
        paddingRight: 22
      }
    }
  }
})

const TablePaginationActions = withStyles(actionsStyles, {
  withTheme: true
})(TablePagination)

export default TablePaginationActions
