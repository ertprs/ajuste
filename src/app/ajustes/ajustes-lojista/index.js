// import { withStyles } from '@material-ui/core/styles'
import React from 'react'
import SolicitacaoLojista from '../components/solicitacao-lojista'
import TitlePage from '../../../components/title'
import './styles.css'
// import Api from '../../../services/Api'

export default function AjustesLojista (props) {
  return (
    <>
      <TitlePage text={'Ajuste - Lojista'} />
       <div className='principal'>
         <SolicitacaoLojista { ...props } />
       </div>
    </>
  )
}
