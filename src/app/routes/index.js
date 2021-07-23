import {
  ImportacaoManual,
  Historico,
  ConferirRemessa,
  ConferirRetorno,
  RemessaFaturamento
} from '../emissao-registro'
import {
  HistoricoProcessamento,
  ConferirRecebimento,
  ConferirProcessamento,
  ConferirProcessamentoCarteira,
  BatimentoProcessamento,
  ProcessamentoImportacaoManual
} from '../processamento-pagamento'
import {
  BatimentoParcelasMaster,
  BatimentoParcelasMasterAgrupadas,
  BatimentoParcelasMasterT140,
  BatimentoInternacionalMaster,
  FechamentoInternacionalMaster,
  ContaGarantidaMaster
} from '../mastercard'
import { AcompanhamentoTarifas, AcompanhamentoTarifasContas } from '../tarifas'
import {
  AcompanhamentoAcordos,
  TitulosAcordos,
  ComplementarAcordos,
  BatimentoRetornoComplementarAcordos,
  RetornosAcordos,
  Acordos,
  Batimento,
  RegistradosRetorno,
  Pendentes,
  RegistradosComplementarAcordos,
  HistoricoParcelasRecupera,
  RecuperaRegistrados,
  RecuperaPagamento,
  RecuperaBatimento
} from '../acordos'
import { GerenciamentoJuridico, ImportacaoManualJuridico } from '../juridico'
import { Page403 } from '../others'
import { AjustesPortador, AjustesLojista, RelatorioAjuste, AjustesLote } from '../ajustes'
import { ImportacaoManualFidc, PagamentoRav, RepasseFundo } from '../fidc'
import { AcompanhamentoCedente, ImportacaoManualCedente } from '../cedentes'
import { adiantamento, listagem } from '../viagens'
import { ImportacaoManualCadoc, Conversao4060 } from '../cadoc'
import { HistoricoBancarizacao,
  ImportacaoManualBancarizacao, ArquivoRejeicao,
  RelatorioAnalitico, ParceladoBancarizacao, AnaliticoArquivo,
  AnaliticoStage, HistoricoDepara, BatimentoDepara,
  ImportacaoArquivoRejeicao, HistoricoAnalitico } from '../bancarizacao'
import { TransacaoFatura, Blocos, FaturamentoHistoricoBloco, ServicosFinanceiros } from '../faturamento'
import { ImportacaoManualFortPagamento, HistoricoRepasseLojista } from '../fortpagamento'
import { GerenciamentoFatura } from '../lastro-iracema'
import { ImportacaoManualRetornoSyspag, RemessaSyspag, RetornoSyspag, ConferirSinteticoSyspag, ConferirAnaliticoSyspag, RepassePendenteSyspag } from '../syspag'
import { ControleCcbs } from '../controle-ccbs'
import { ContratosRecebiveis, InformeLiquidacao, PesquisarRegistro, RegistroRecebiveis } from '../recebiveis'

const mainRoutes = [
  // Others
  {
    path: '/app/403',
    component: Page403,
    id: '403',
    exact: true
  },
  // Emissao
  {
    path: '/app/emissao-registro/historico',
    component: Historico,
    id: 'Emissao e registro',
    exact: true
  },
  {
    path: '/app/emissao-registro/conferir-remessa',
    component: ConferirRemessa,
    id: 'Emissao e registro',
    exact: true
  },
  {
    path: '/app/emissao-registro/conferir-retorno',
    component: ConferirRetorno,
    id: 'Emissao e registro',
    exact: true
  },
  {
    path: '/app/emissao-registro/remessa-faturamento',
    component: RemessaFaturamento,
    id: 'Emissao e registro',
    exact: true
  },
  {
    path: '/app/emissao-registro/importacao-manual',
    component: ImportacaoManual,
    id: 'Emissao e registro',
    exact: true
  },
  // Processamento
  {
    path: '/app/processamento-pagamento/historico-processamento',
    component: HistoricoProcessamento,
    id: 'Processamento e Pagamento',
    exact: true
  },
  {
    path: '/app/processamento-pagamento/conferir-recebimento',
    component: ConferirRecebimento,
    id: 'Processamento e Pagamento',
    exact: true
  },
  {
    path: '/app/processamento-pagamento/conferir-processamento',
    component: ConferirProcessamento,
    id: 'Processamento e Pagamento',
    exact: true
  },
  {
    path: '/app/processamento-pagamento/conferir-processamento/carteira',
    component: ConferirProcessamentoCarteira,
    id: 'Processamento e Pagamento',
    exact: true
  },
  {
    path: '/app/processamento-pagamento/batimento-processament',
    component: BatimentoProcessamento,
    id: 'Processamento e Pagamento',
    exact: true
  },
  {
    path: '/app/processamento-pagamento/importacao-manual',
    component: ProcessamentoImportacaoManual,
    id: 'Processamento e Pagamento',
    exact: true
  },
  // Mastercard
  {
    path: '/app/mastercard/batimento-parcelas-master',
    component: BatimentoParcelasMaster,
    id: 'Mastercard',
    exact: true
  },
  {
    path: '/app/mastercard/batimento-parcelas-master-agrupadas',
    component: BatimentoParcelasMasterAgrupadas,
    id: 'Mastercard',
    exact: true
  },
  {
    path: '/app/mastercard/batimento-parcelas-master-t140',
    component: BatimentoParcelasMasterT140,
    id: 'Mastercard',
    exact: true
  },
  {
    path: '/app/mastercard/batimento-internacional',
    component: BatimentoInternacionalMaster,
    id: 'Mastercard',
    exact: true
  },
  {
    path: '/app/mastercard/fechamento-internacional',
    component: FechamentoInternacionalMaster,
    id: 'Mastercard',
    exact: true
  },
  {
    path: '/app/mastercard/conta-garantida',
    component: ContaGarantidaMaster,
    id: 'Mastercard',
    exact: true
  },
  // Tarifas
  {
    path: '/app/tarifas/acompanhamento-tarifas',
    component: AcompanhamentoTarifas,
    id: 'Tarifas',
    exact: true
  },
  {
    path: '/app/tarifas/acompanhamento-tarifas-contas',
    component: AcompanhamentoTarifasContas,
    id: 'Tarifas',
    exact: true
  },
  // Acordos
  {
    path: '/app/acordos/historico-acordos',
    component: AcompanhamentoAcordos,
    id: 'Acordos',
    exact: true
  },
  {
    path: '/app/acordos/verificar-titulos',
    component: TitulosAcordos,
    id: 'Acordos',
    exact: true
  },
  {
    path: '/app/acordos/verificar-complementar',
    component: ComplementarAcordos,
    id: 'Acordos',
    exact: true
  },
  {
    path: '/app/acordos/batimento-retorno-complementar',
    component: BatimentoRetornoComplementarAcordos,
    id: 'Acordos',
    exact: true
  },
  {
    path: '/app/acordos/retorno-acordo',
    component: RetornosAcordos,
    id: 'Acordos',
    exact: true
  },
  {
    path: '/app/acordos/analitico-acordos',
    component: Acordos,
    id: 'Acordos',
    exact: true
  },
  {
    path: '/app/acordos/batimento',
    component: Batimento,
    id: 'Acordos',
    exact: true
  },
  {
    path: '/app/acordos/registrados-retorno',
    component: RegistradosRetorno,
    id: 'Acordos',
    exact: true
  },
  {
    path: '/app/acordos/erros-operacionais',
    component: Pendentes,
    id: 'Acordos',
    exact: true
  },
  {
    path: '/app/acordos/complementar-registrados',
    component: RegistradosComplementarAcordos,
    id: 'Acordos',
    exact: true
  },
  // Acordos Recupera
  {
    path: '/app/acordos/historico-parcelas-recupera',
    component: HistoricoParcelasRecupera,
    id: 'Acordos',
    exact: true
  },
  {
    path: '/app/acordos/recupera-registrados',
    component: RecuperaRegistrados,
    id: 'Acordos',
    exact: true
  },
  {
    path: '/app/acordos/recupera-verificar-pagamento',
    component: RecuperaPagamento,
    id: 'Acordos',
    exact: true
  },
  {
    path: '/app/acordos/recupera-batimento-parcelas',
    component: RecuperaBatimento,
    id: 'Acordos',
    exact: true
  },
  // Juridico
  {
    path: '/app/juridico/gerenciamento-juridico',
    component: GerenciamentoJuridico,
    id: 'Juridico',
    exact: true
  },
  {
    path: '/app/juridico/importacao-manual',
    component: ImportacaoManualJuridico,
    id: 'Juridico',
    exact: true
  },
  // Ajustes
  {
    path: '/app/ajustes/portador',
    component: AjustesPortador,
    id: 'Ajustes',
    exact: true
  },
  {
    path: '/app/ajustes/lojista',
    component: AjustesLojista,
    id: 'Ajustes',
    exact: true
  },
  {
    path: '/app/ajustes/relatorio-ajuste',
    component: RelatorioAjuste,
    id: 'Ajustes Relatorio',
    exact: true
  },
  {
    path: '/app/ajustes/lote',
    component: AjustesLote,
    id: 'Ajustes'
  },
  // Fidc
  {
    path: '/app/fidc/importacao-manual',
    component: ImportacaoManualFidc,
    id: 'Fidc',
    exact: true
  },
  {
    path: '/app/fidc/pagamento-rav',
    component: PagamentoRav,
    id: 'Fidc',
    exact: true
  },
  {
    path: '/app/fidc/repasse-fundo',
    component: RepasseFundo,
    id: 'Fidc',
    exact: true
  },
  // Cedentes
  {
    path: '/app/cedentes/importacao-manual-pier',
    component: ImportacaoManualCedente,
    id: 'Cedente',
    exact: true
  },
  {
    path: '/app/cedentes/acompanhamento-cedente',
    component: AcompanhamentoCedente,
    id: 'Cedente',
    exact: true
  },
  // Viagens
  {
    path: '/app/viagens/solicitacao-adiantamento',
    component: adiantamento,
    id: 'Viagens',
    exact: true
  },
  {
    path: '/app/viagens/listagem',
    component: listagem,
    id: 'Viagens',
    exact: true
  },
  // cadoc
  {
    path: '/app/cadoc/importacao',
    component: ImportacaoManualCadoc,
    id: 'Cadoc',
    exact: true
  },
  {
    path: '/app/cadoc/conversao_4060',
    component: Conversao4060,
    id: 'Cadoc',
    exact: true
  },
  // Faturamento
  {
    path: '/app/faturamento/transacao-fatura',
    component: TransacaoFatura,
    id: 'Faturamento',
    exact: true
  },
  {
    path: '/app/faturamento/blocos',
    component: Blocos,
    id: 'Faturamento',
    exact: true
  },
  {
    path: '/app/faturamento/historico-bloco',
    component: FaturamentoHistoricoBloco,
    id: 'Faturamento',
    exact: true
  },
  {
    path: '/app/faturamento/servicos-financeiros',
    component: ServicosFinanceiros,
    id: 'Faturamento',
    exact: true
  },
  // Bancarizacao
  {
    path: '/app/bancarizacao/rotativo-bancarizacao',
    component: HistoricoBancarizacao,
    id: 'Bancarizacao',
    exact: true
  },
  {
    path: '/app/bancarizacao/importacao-manual',
    component: ImportacaoManualBancarizacao,
    id: 'Bancarizacao',
    exact: true
  },
  {
    path: '/app/bancarizacao/relatorio-analitico',
    component: RelatorioAnalitico,
    id: 'Bancarizacao',
    exact: true
  },
  {
    path: '/app/bancarizacao/parcelado-bancarizacao',
    component: ParceladoBancarizacao,
    id: 'Bancarizacao',
    exact: true
  },
  {
    path: '/app/bancarizacao/analitico-arquivo',
    component: AnaliticoArquivo,
    id: 'Bancarizacao',
    exact: true
  },
  {
    path: '/app/bancarizacao/analitico-base-unica',
    component: AnaliticoStage,
    id: 'Bancarizacao',
    exact: true
  },
  {
    path: '/app/bancarizacao/historico-ccbs',
    component: HistoricoDepara,
    id: 'Bancarizacao',
    exact: true
  },
  {
    path: '/app/bancarizacao/batimento-ccbs',
    component: BatimentoDepara,
    id: 'Bancarizacao',
    exact: true
  },
  {
    path: '/app/bancarizacao/arquivo-rejeicao',
    component: ArquivoRejeicao,
    id: 'Bancarizacao',
    exact: true
  },
  {
    path: '/app/bancarizacao/importacao-rejeicao',
    component: ImportacaoArquivoRejeicao,
    id: 'Bancarizacao',
    exact: true
  },
  {
    path: '/app/bancarizacao/depara-analitico',
    component: HistoricoAnalitico,
    id: 'Bancarizacao',
    exact: true
  },
  // Fortpagamento
  {
    path: '/app/fortpagamento/historico-fortpagamento',
    component: HistoricoRepasseLojista,
    id: 'Fortpagamento',
    exact: true
  },
  {
    path: '/app/fortpagamento/importacao-manual',
    component: ImportacaoManualFortPagamento,
    id: 'Fortpagamento',
    exact: true
  },
  // Lastro Iracema
  {
    path: '/app/lastro-iracema/faturas',
    component: GerenciamentoFatura,
    id: 'Lastro Iracema',
    exact: true
  },
  // Syspag
  {
    path: '/app/syspag/importacao-manual',
    component: ImportacaoManualRetornoSyspag,
    id: 'Syspag',
    exact: true
  },
  {
    path: '/app/syspag/remessa',
    component: RemessaSyspag,
    id: 'Syspag',
    exact: true
  },
  {
    path: '/app/syspag/retorno',
    component: RetornoSyspag,
    id: 'Syspag',
    exact: true
  },
  {
    path: '/app/syspag/conferir-sintetico',
    component: ConferirSinteticoSyspag,
    id: 'Syspag',
    exact: true
  },
  {
    path: '/app/syspag/conferir-analitico',
    component: ConferirAnaliticoSyspag,
    id: 'Syspag',
    exact: true
  },
  {
    path: '/app/syspag/repasse-pendente',
    component: RepassePendenteSyspag,
    id: 'Syspag'
  },
  // Controle de CCBS
  {
    path: '/app/controle-ccbs/controle-ccb',
    component: ControleCcbs,
    id: 'Controle de CCBS',
    exact: true
  },
  // Recebiveis
  {
    path: '/app/recebiveis/registro-recebiveis',
    component: RegistroRecebiveis,
    id: 'Recebiveis',
    exact: true
  },
  {
    path: '/app/recebiveis/informe-liquidacao',
    component: InformeLiquidacao,
    id: 'Recebiveis',
    exact: true
  },
  {
    path: '/app/recebiveis/pesquisar-registro',
    component: PesquisarRegistro,
    id: 'Recebiveis',
    exact: true
  },
  {
    path: '/app/recebiveis/contratos',
    component: ContratosRecebiveis,
    id: 'Recebiveis',
    exact: true
  }
]

export default mainRoutes
