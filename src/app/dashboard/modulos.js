import React from 'react'
import { ImportacaoManual, Historico } from '../emissao-registro'
import { HistoricoProcessamento, ProcessamentoImportacaoManual } from '../processamento-pagamento'
import { ImportacaoManualCadoc, Conversao4060 } from '../cadoc'
import { BatimentoParcelasMaster, BatimentoInternacionalMaster, ContaGarantidaMaster } from '../mastercard'
import { AcompanhamentoTarifas } from '../tarifas'
import { AcompanhamentoAcordos, HistoricoParcelasRecupera } from '../acordos'
import { GerenciamentoJuridico, ImportacaoManualJuridico } from '../juridico'
import { AjustesPortador, AjustesLojista, RelatorioAjuste, AjustesLote } from '../ajustes'
import { PagamentoRav, ImportacaoManualFidc, RepasseFundo } from '../fidc'
import { AcompanhamentoCedente, ImportacaoManualCedente } from '../cedentes'
import { adiantamento, listagem } from '../viagens'
import * as Bancarizacao from '../bancarizacao'
import { ImportacaoManualRetornoSyspag, RetornoSyspag } from '../syspag'
import { TransacaoFatura, Blocos, ServicosFinanceiros } from '../faturamento'
// icons
import AssignmentIcon from '@material-ui/icons/Assignment'
import { FaCcMastercard, FaMoneyBillWave, FaHandshake, FaTools, FaStoreAlt, FaFileInvoiceDollar, FaCashRegister } from 'react-icons/fa'
import { GiInjustice, GiTakeMyMoney, GiReceiveMoney, GiProcessor, GiBank, GiCash, GiPayMoney, GiArrowDunk } from 'react-icons/gi'
import PaymentIcon from '@material-ui/icons/Payment'
import { ImportacaoManualFortPagamento, HistoricoRepasseLojista } from '../fortpagamento'
import { GerenciamentoFatura } from '../lastro-iracema'
import { ControleCcbs } from '../controle-ccbs'
import { InformeLiquidacao, RegistroRecebiveis, ContratosRecebiveis } from '../recebiveis'

const mainModules = [
  // Emissao
  {
    id: 'Emissao e registro',
    label: 'Emissao e registro',
    icon: <AssignmentIcon style={{ color: 'green', fontSize: 40 }} />,
    sub: [
      {
        path: '/app/emissao-registro/historico',
        component: Historico,
        id: 'Emissao e registro',
        name: 'Acompanhamento'
      },
      {
        path: '/app/emissao-registro/importacao-manual',
        component: ImportacaoManual,
        id: 'Emissao e registro',
        name: 'Importação Manual'
      }
    ]
  },
  // Processamento
  {
    id: 'Processamento e Pagamento',
    label: 'Processamento e Pagamento',
    icon: <PaymentIcon style={{ color: 'green', fontSize: 40 }} />,
    sub: [
      {
        path: '/app/processamento-pagamento/historico-processamento',
        component: HistoricoProcessamento,
        id: 'Processamento e Pagamento',
        name: 'Acompanhamento'
      },
      {
        path: '/app/processamento-pagamento/importacao-manual',
        component: ProcessamentoImportacaoManual,
        id: 'Processamento e pagamento',
        name: 'Importação Manual'
      }
    ]
  },
  // Mastercard
  {
    id: 'Mastercard',
    label: 'Mastercard',
    icon: <FaCcMastercard style={{ color: 'green', fontSize: 40 }} />,
    sub: [
      {
        path: '/app/mastercard/batimento-parcelas-master',
        component: BatimentoParcelasMaster,
        id: 'Mastercard',
        name: 'Nacional'
      },
      {
        path: '/app/mastercard/batimento-internacional',
        component: BatimentoInternacionalMaster,
        id: 'Mastercard',
        name: 'Internacional'
      },
      {
        path: '/app/mastercard/conta-garantida',
        component: ContaGarantidaMaster,
        id: 'Mastercard',
        name: 'Conta Garantida'
      }
    ]
  },
  // Tarifas
  {
    id: 'Tarifas',
    label: 'Tarifas',
    icon: <FaMoneyBillWave style={{ color: 'green', fontSize: 40 }} />,
    sub: [
      {
        path: '/app/tarifas/acompanhamento-tarifas',
        component: AcompanhamentoTarifas,
        id: 'Tarifas',
        name: 'Acompanhamento'
      }
    ]
  },
  // Acordos
  {
    id: 'Acordos',
    label: 'Acordos',
    icon: <FaHandshake style={{ color: 'green', fontSize: 40 }} />,
    sub: [
      {
        path: '/app/acordos/historico-acordos',
        component: AcompanhamentoAcordos,
        id: 'Acordos',
        name: 'Histórico'
      },
      {
        path: '/app/acordos/historico-parcelas-recupera',
        component: HistoricoParcelasRecupera,
        id: 'Acordos',
        name: 'Recupera'
      }
    ]
  },
  // Juridico
  {
    id: 'Juridico',
    label: 'Juridico',
    icon: <GiInjustice style={{ color: 'green', fontSize: 40 }} />,
    sub: [
      {
        path: '/app/juridico/gerenciamento-juridico',
        component: GerenciamentoJuridico,
        id: 'Juridico',
        name: 'Documentos'
      },
      {
        path: '/app/juridico/importacao-manual',
        component: ImportacaoManualJuridico,
        id: 'Juridico',
        name: 'Envio de E-mail'
      }
    ]
  },
  // Ajustes
  {
    id: 'Ajustes',
    label: 'Ajustes',
    icon: <FaTools style={{ color: 'green', fontSize: 40 }} />,
    sub: [
      {
        path: '/app/ajustes/portador',
        component: AjustesPortador,
        id: 'Ajustes',
        name: 'Portador'
      },
      {
        path: '/app/ajustes/lojista',
        component: AjustesLojista,
        id: 'Ajustes',
        name: 'Lojista'
      },
      {
        path: '/app/ajustes/lote',
        component: AjustesLote,
        id: 'Ajustes',
        name: 'Ajustes em lote'
      },
      {
        path: '/app/ajustes/relatorio-ajuste',
        component: RelatorioAjuste,
        id: 'Ajustes Relatorio',
        name: 'Relatório'
      }
    ]
  },
  // Fidc
  {
    id: 'Fidc',
    label: 'FIDC Iracema',
    icon: <GiTakeMyMoney style={{ color: 'green', fontSize: 40 }} />,
    sub: [
      {
        path: '/app/fidc/importacao-manual',
        component: ImportacaoManualFidc,
        id: 'Fidc',
        name: 'Importação Manual'
      },
      {
        path: '/app/fidc/pagamento-rav',
        component: PagamentoRav,
        id: 'Fidc',
        name: 'Pagamento Rav'
      },
      {
        path: '/app/fidc/repasse-fundo',
        component: RepasseFundo,
        id: 'Fidc',
        name: 'Repasse Fundo'
      }
    ]
  },
  // Cedentes
  {
    id: 'Cedente',
    label: 'Cedentes',
    icon: <GiArrowDunk style={{ color: 'green', fontSize: 40 }} />,
    sub: [
      {
        path: '/app/cedentes/importacao-manual-pier',
        component: ImportacaoManualCedente,
        id: 'Cedente',
        name: 'Importação Manual'
      },
      {
        path: '/app/cedentes/acompanhamento-cedente',
        component: AcompanhamentoCedente,
        id: 'Cedente',
        name: 'Acompanhamento cedente'
      }
    ]
  },
  // Vianges
  {
    id: 'Viagens',
    label: 'Viagens',
    icon: <GiReceiveMoney style={{ color: 'green', fontSize: 40 }} />,
    sub: [
      {
        path: '/app/viagens/solicitacao-adiantamento',
        component: adiantamento,
        id: 'Viagens',
        name: 'Solicitação'
      },
      {
        path: '/app/viagens/listagem',
        component: listagem,
        id: 'Viagens',
        name: 'Acompanhamento'
      }
    ]
  },
  // Cadoc
  {
    id: 'Cadoc',
    label: 'Cadoc',
    icon: <GiProcessor style={{ color: 'green', fontSize: 40 }} />,
    sub: [
      {
        path: '/app/cadoc/importacao',
        component: ImportacaoManualCadoc,
        id: 'Cadoc',
        name: '4010'
      },
      {
        path: '/app/cadoc/conversao_4060',
        component: Conversao4060,
        id: 'Cadoc',
        name: 'Conversão 4060'
      }
    ]
  },
  // Bancarizacao
  {
    id: 'Bancarizacao',
    label: 'Bancarizacão',
    icon: <GiBank style={{ color: 'green', fontSize: 40 }} />,
    sub: [
      {
        path: '/app/bancarizacao/rotativo-bancarizacao',
        component: Bancarizacao.HistoricoBancarizacao,
        id: 'Bancarizacao',
        name: 'Rotativo'
      },
      {
        path: '/app/bancarizacao/parcelado-bancarizacao',
        component: Bancarizacao.ParceladoBancarizacao,
        id: 'Bancarizacao',
        name: 'Parcelado'
      },
      {
        path: '/app/bancarizacao/importacao-manual',
        component: Bancarizacao.ImportacaoManualBancarizacao,
        id: 'Bancarizacao',
        name: 'Importação manual'
      },
      {
        path: '/app/bancarizacao/historico-ccbs',
        component: Bancarizacao.HistoricoDepara,
        id: 'Bancarizacao',
        name: 'Historico CCBS'
      },
      {
        path: '/app/bancarizacao/importacao-rejeicao',
        component: Bancarizacao.ArquivoRejeicao,
        id: 'Bancarizacao',
        name: 'Importação Rejeição'
      }
    ]
  },
  // Faturamento
  {
    id: 'Faturamento',
    label: 'Faturamento',
    icon: <GiCash style={{ color: 'green', fontSize: 40 }} />,
    sub: [
      {
        path: '/app/faturamento/transacao-fatura',
        component: TransacaoFatura,
        id: 'Default',
        name: 'Transação Fatura'
      },
      {
        path: '/app/faturamento/blocos',
        component: Blocos,
        id: 'Default',
        name: 'Histórico por blocos'
      },
      {
        path: '/app/faturamento/servicos-financeiros',
        component: ServicosFinanceiros,
        id: 'Default',
        name: 'Serviços Financeiros'
      }
    ]
  },
  // Fortpagamento - Repasse Lojista
  {
    id: 'Fortpagamento',
    label: 'Repasse Lojista',
    icon: <FaStoreAlt style={{ color: 'green', fontSize: 40 }} />,
    sub: [
      {
        path: '/app/fortpagamento/historico-fortpagamento',
        component: HistoricoRepasseLojista,
        id: 'Fortpagamento',
        name: 'Acompanhamento Repasse Lojista'
      },
      {
        path: '/app/fortpagamento/importacao-manual',
        component: ImportacaoManualFortPagamento,
        id: 'Fortpagamento',
        name: 'Importação Manual'
      }
    ]
  },
  // Lastro Iracema Fatura
  {
    id: 'Lastro Iracema',
    label: 'FIDC Iracema II',
    icon: <FaFileInvoiceDollar style={{ color: 'green', fontSize: 40 }} />,
    sub: [
      {
        path: '/app/lastro-iracema/faturas',
        component: GerenciamentoFatura,
        id: 'Lastro Iracema',
        name: 'Faturas'
      }
    ]
  },
  // Syspag
  {
    id: 'Syspag',
    label: 'Syspag',
    icon: <GiPayMoney style={{ color: 'green', fontSize: 40 }} />,
    sub: [
      {
        path: '/app/syspag/importacao-manual',
        component: ImportacaoManualRetornoSyspag,
        id: 'Syspag',
        name: 'Importação Retorno'
      },
      // {
      //   path: '/app/syspag/remessa',
      //   component: RemessaSyspag,
      //   id: 'Syspag',
      //   name: 'Remessa'
      // },
      {
        path: '/app/syspag/retorno',
        component: RetornoSyspag,
        id: 'Syspag',
        name: 'Acompanhamento'
      }
    ]
  },
  // Controle de CCBS
  {
    id: 'Controle de CCBS',
    label: 'Controle de CCBS',
    icon: <GiProcessor style={{ color: 'green', fontSize: 40 }} />,
    sub: [
      {
        path: '/app/controle-ccbs/controle-ccb',
        component: ControleCcbs,
        id: 'Controle de CCBS',
        name: 'Controle de CCBS'
      }
    ]
  },
  // Recebiveis
  {
    id: 'Recebiveis',
    label: 'Recebíveis',
    icon: <FaCashRegister style={{ color: 'green', fontSize: 40 }} />,
    sub: [
      {
        path: '/app/recebiveis/registro-recebiveis',
        component: RegistroRecebiveis,
        id: 'Recebiveis',
        name: 'Registro'
      },
      {
        path: '/app/recebiveis/informe-liquidacao',
        component: InformeLiquidacao,
        id: 'Recebiveis',
        name: 'Liquidação'
      },
      {
        path: '/app/recebiveis/contratos',
        component: ContratosRecebiveis,
        id: 'Recebiveis',
        name: 'Contratos'
      }
    ]
  }
]

export default mainModules
