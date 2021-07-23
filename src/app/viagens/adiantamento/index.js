import React from 'react'
import TitlePage from '../../../components/title'
import SolicitacaoAdiantamento from '../components/solicitacao-adiantamento'

import './style.css'

export default function adiantamento (props) {
  return (
    <>
        <TitlePage text={'Solicitação Adiantamento'} />
        <div className={'principal'}>
          <SolicitacaoAdiantamento { ...props } />
        </div>
    </>
  )
}
