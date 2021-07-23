// import { withStyles } from '@material-ui/core/styles'
import React from 'react'
import SolicitacaoPortador from '../components/solicitacao-portador'
import TitlePage from '../../../components/title'
import './styles.css'
// import Api from '../../../services/Api'

export default function AjustesPortador (props) {
  return (
    <>
      <TitlePage text={'Ajuste - Portador'} />
       <div className='principal'>
         <SolicitacaoPortador { ...props } />
       </div>
    </>
  )
}
