import React from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import moment from 'moment'
import { IoMdClose } from 'react-icons/io'

const styleHeader = {
  padding: '10px',
  float: 'right',
  opacity: '0.6',
  fontSize: '14px'
}

export default function SimpleTable ({ data, textHeader, exclude, excluirItem }) {
  return (
    <Paper>
      <p style={styleHeader}>{textHeader}</p>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="right">Ajuste</TableCell>
            <TableCell align="right">ID Conta</TableCell>
            <TableCell align="right">Valor</TableCell>
            <TableCell align="right">Data</TableCell>
            <TableCell align="right">Motivo</TableCell>
            <TableCell align="right">Setor Solicitante</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={Math.random()}>
              <TableCell align="right">
                {row.descAjuste }
              </TableCell>
              <TableCell align="right">{row.idconta}</TableCell>
              <TableCell align="right">{row.valor}</TableCell>
              <TableCell align="right">{moment(row.date, 'YYYY-MM-DD').format('DD/MM/YYYY')}</TableCell>
              <TableCell align="right">{row.motivo}</TableCell>
              <TableCell align="right">{row.setor}</TableCell>
              <TableCell align="right">{exclude ? <IoMdClose style={{ cursor: 'pointer' }} onClick={() => excluirItem(index)} /> : null }</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}
