import React from 'react'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import AssignmentIcon from '@material-ui/icons/Assignment'
import classNames from 'classnames'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Collapse from '@material-ui/core/Collapse'
import { Link } from 'react-router-dom'
import { FaCcMastercard, FaMoneyBillWave, FaHandshake, FaTools, FaStoreAlt, FaFileInvoiceDollar, FaCashRegister } from 'react-icons/fa'
import { GiInjustice, GiTakeMyMoney, GiReceiveMoney, GiProcessor, GiBank, GiCash, GiPayMoney, GiArrowDunk } from 'react-icons/gi'
import PaymentIcon from '@material-ui/icons/Payment'

const iconMasterStyle = {
  fontSize: '22px'
}

const modulos = (props) => {
  const { permissoes, classes, handleListOptions, state } = props
  return (
    <div style={{ position: 'absolute', top: 130, width: '100%' }}>
      <Divider />
      {permissoes.includes('Emissao e registro') ? (
        <List>
          <ListItem button onClick={handleListOptions} id="financeiro">
            <ListItemIcon className={classNames(classes.menuButton)}>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText
              disableTypography
              primary={
                <Typography
                  className={classNames(
                    classes.listTextItem,
                    classes.listTextItemMenu
                  )}
                >
                  Emissão e Registro
                </Typography>
              }
            />
            {state.open_list & (state.menuValue === 'financeiro') ? (
              <ExpandLess className={classes.expandMenu} />
            ) : (
              <ExpandMore className={classes.expandMenu} />
            )}
          </ListItem>
          {state.menuValue === 'financeiro' && (
            <Collapse in={state.open_list} timeout="auto" unmountOnExit>
              <List component="div">
                <ListItem
                  button
                  component={Link}
                  to={'/app/emissao-registro/historico'}
                >
                  {!state.open && (
                    <ListItemIcon className={classNames(classes.menuButton)}>
                      <span>AC</span>
                    </ListItemIcon>
                  )}
                  <ListItemText
                    inset
                    disableTypography
                    primary={
                      <Typography className={classes.listTextItem}>
                        <span>Acompanhamento</span>
                      </Typography>
                    }
                  />
                </ListItem>
                <ListItem
                  button
                  component={Link}
                  to={'/app/emissao-registro/importacao-manual'}
                >
                  {!state.open && (
                    <ListItemIcon className={classNames(classes.menuButton)}>
                      <span>IM</span>
                    </ListItemIcon>
                  )}
                  <ListItemText
                    inset
                    disableTypography
                    primary={
                      <Typography className={classes.listTextItem}>
                        <span>Importação Manual</span>
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
            </Collapse>
          )}
        </List>
      ) : null}
      {permissoes.includes('Processamento e Pagamento') ? (
        <List>
          <ListItem button onClick={handleListOptions} id="processamento">
            <ListItemIcon className={classNames(classes.menuButton)}>
              <PaymentIcon />
            </ListItemIcon>
            <ListItemText
              disableTypography
              primary={
                <Typography
                  className={classNames(
                    classes.listTextItem,
                    classes.listTextItemMenu
                  )}
                >
                  Pagamentos Portador
                </Typography>
              }
            />
            {state.open_list & (state.menuValue === 'processamento') ? (
              <ExpandLess className={classes.expandMenu} />
            ) : (
              <ExpandMore className={classes.expandMenu} />
            )}
          </ListItem>
          {state.menuValue === 'processamento' && (
            <Collapse in={state.open_list} timeout="auto" unmountOnExit>
              <List component="div">
                <ListItem
                  button
                  component={Link}
                  to={'/app/processamento-pagamento/historico-processamento'}
                >
                  {!state.open && (
                    <ListItemIcon className={classNames(classes.menuButton)}>
                      <span>AC</span>
                    </ListItemIcon>
                  )}
                  <ListItemText
                    inset
                    disableTypography
                    primary={
                      <Typography className={classes.listTextItem}>
                        <span>Acompanhamento</span>
                      </Typography>
                    }
                  />
                </ListItem>
                <ListItem
                  button
                  component={Link}
                  to={'/app/processamento-pagamento/importacao-manual'}
                >
                  {!state.open && (
                    <ListItemIcon className={classNames(classes.menuButton)}>
                      <span>IM</span>
                    </ListItemIcon>
                  )}
                  <ListItemText
                    inset
                    disableTypography
                    primary={
                      <Typography className={classes.listTextItem}>
                        <span>Importação Manual</span>
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
            </Collapse>
          )}
        </List>
      ) : null}
      {permissoes.includes('Mastercard') ? (
        <List>
          <ListItem button onClick={handleListOptions} id="mastercard">
            <ListItemIcon className={classNames(classes.menuButton)}>
              <FaCcMastercard style={iconMasterStyle} />
            </ListItemIcon>
            <ListItemText
              disableTypography
              primary={
                <Typography
                  className={classNames(
                    classes.listTextItem,
                    classes.listTextItemMenu
                  )}
                >
                  Mastercard
                </Typography>
              }
            />
            {state.open_list & (state.menuValue === 'mastercard') ? (
              <ExpandLess className={classes.expandMenu} />
            ) : (
              <ExpandMore className={classes.expandMenu} />
            )}
          </ListItem>
          {state.menuValue === 'mastercard' && (
            <Collapse in={state.open_list} timeout="auto" unmountOnExit>
              <List component="div">
                <ListItem
                  button
                  component={Link}
                  to={'/app/mastercard/batimento-parcelas-master'}
                >
                  {!state.open && (
                    <ListItemIcon className={classNames(classes.menuButton)}>
                      <span>NA</span>
                    </ListItemIcon>
                  )}
                  <ListItemText
                    inset
                    disableTypography
                    primary={
                      <Typography className={classes.listTextItem}>
                        <span>Nacional</span>
                      </Typography>
                    }
                  />
                </ListItem>
                <ListItem
                  button
                  component={Link}
                  to={'/app/mastercard/batimento-internacional'}
                >
                  {!state.open && (
                    <ListItemIcon className={classNames(classes.menuButton)}>
                      <span>IN</span>
                    </ListItemIcon>
                  )}
                  <ListItemText
                    inset
                    disableTypography
                    primary={
                      <Typography className={classes.listTextItem}>
                        <span>Internacional</span>
                      </Typography>
                    }
                  />
                </ListItem>

                <ListItem
                  button
                  component={Link}
                  to={'/app/mastercard/conta-garantida'}
                >
                  {!state.open && (
                    <ListItemIcon className={classNames(classes.menuButton)}>
                      <span>CG</span>
                    </ListItemIcon>
                  )}
                  <ListItemText
                    inset
                    disableTypography
                    primary={
                      <Typography className={classes.listTextItem}>
                        <span>Conta garantida</span>
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
            </Collapse>
          )}
        </List>
      ) : null}
      {permissoes.includes('Tarifas') ? (
        <List>
          <ListItem button onClick={handleListOptions} id="tarifas">
            <ListItemIcon className={classNames(classes.menuButton)}>
              <FaMoneyBillWave style={iconMasterStyle} />
            </ListItemIcon>
            <ListItemText
              disableTypography
              primary={
                <Typography
                  className={classNames(
                    classes.listTextItem,
                    classes.listTextItemMenu
                  )}
                >
                  Tarifas
                </Typography>
              }
            />
            {state.open_list & (state.menuValue === 'tarifas') ? (
              <ExpandLess className={classes.expandMenu} />
            ) : (
              <ExpandMore className={classes.expandMenu} />
            )}
          </ListItem>
          {state.menuValue === 'tarifas' && (
            <Collapse in={state.open_list} timeout="auto" unmountOnExit>
              <List component="div">
                <ListItem
                  button
                  component={Link}
                  to={'/app/tarifas/acompanhamento-tarifas'}
                >
                  {!state.open && (
                    <ListItemIcon className={classNames(classes.menuButton)}>
                      <span>TA</span>
                    </ListItemIcon>
                  )}
                  <ListItemText
                    inset
                    disableTypography
                    primary={
                      <Typography className={classes.listTextItem}>
                        <span>Acompanhamento</span>
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
            </Collapse>
          )}
        </List>
      ) : null}
      {permissoes.includes('Acordos') ? (
        <List>
          <ListItem button onClick={handleListOptions} id="Acordos">
            <ListItemIcon className={classNames(classes.menuButton)}>
              <FaHandshake style={iconMasterStyle} />
            </ListItemIcon>
            <ListItemText
              disableTypography
              primary={
                <Typography
                  className={classNames(
                    classes.listTextItem,
                    classes.listTextItemMenu
                  )}
                >
                  Acordos
                </Typography>
              }
            />
            {state.open_list & (state.menuValue === 'Acordos') ? (
              <ExpandLess className={classes.expandMenu} />
            ) : (
              <ExpandMore className={classes.expandMenu} />
            )}
          </ListItem>
          {state.menuValue === 'Acordos' && (
            <Collapse in={state.open_list} timeout="auto" unmountOnExit>
              <List component="div">
                <ListItem
                  button
                  component={Link}
                  to={'/app/acordos/historico-acordos'}
                >
                  {!state.open && (
                    <ListItemIcon className={classNames(classes.menuButton)}>
                      <span>AC</span>
                    </ListItemIcon>
                  )}
                  <ListItemText
                    inset
                    disableTypography
                    primary={
                      <Typography className={classes.listTextItem}>
                        <span>Acompanhamento</span>
                      </Typography>
                    }
                  />
                </ListItem>
                <ListItem
                  button
                  component={Link}
                  to={'/app/acordos/historico-parcelas-recupera'}
                >
                  {!state.open && (
                    <ListItemIcon className={classNames(classes.menuButton)}>
                      <span>AC</span>
                    </ListItemIcon>
                  )}
                  <ListItemText
                    inset
                    disableTypography
                    primary={
                      <Typography className={classes.listTextItem}>
                        <span>Recupera</span>
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
            </Collapse>
          )}
        </List>
      ) : null}
      {permissoes.includes('Juridico') ? (
        <List>
          <ListItem button onClick={handleListOptions} id="juridico">
            <ListItemIcon className={classNames(classes.menuButton)}>
              <GiInjustice style={iconMasterStyle} />
            </ListItemIcon>
            <ListItemText
              disableTypography
              primary={
                <Typography
                  className={classNames(
                    classes.listTextItem,
                    classes.listTextItemMenu
                  )}
                >
                  Jurídico
                </Typography>
              }
            />
            {state.open_list & (state.menuValue === 'juridico') ? (
              <ExpandLess className={classes.expandMenu} />
            ) : (
              <ExpandMore className={classes.expandMenu} />
            )}
          </ListItem>
          {state.menuValue === 'juridico' && (
            <Collapse in={state.open_list} timeout="auto" unmountOnExit>
              <List component="div">
                <ListItem
                  button
                  component={Link}
                  to={'/app/juridico/gerenciamento-juridico'}
                >
                  {!state.open && (
                    <ListItemIcon className={classNames(classes.menuButton)}>
                      <span>DO</span>
                    </ListItemIcon>
                  )}
                  <ListItemText
                    inset
                    disableTypography
                    primary={
                      <Typography className={classes.listTextItem}>
                        <span>Documentos</span>
                      </Typography>
                    }
                  />
                </ListItem>
                <ListItem
                  button
                  component={Link}
                  to={'/app/juridico/importacao-manual'}
                >
                  {!state.open && (
                    <ListItemIcon className={classNames(classes.menuButton)}>
                      <span>EE</span>
                    </ListItemIcon>
                  )}
                  <ListItemText
                    inset
                    disableTypography
                    primary={
                      <Typography className={classes.listTextItem}>
                        <span>Envio de E-mail</span>
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
            </Collapse>
          )}
        </List>
      ) : null}
      {permissoes.includes('Ajustes') ? (
        <List>
          <ListItem button onClick={handleListOptions} id="Ajustes">
            <ListItemIcon className={classNames(classes.menuButton)}>
              <FaTools style={iconMasterStyle} />
            </ListItemIcon>
            <ListItemText
              disableTypography
              primary={
                <Typography
                  className={classNames(
                    classes.listTextItem,
                    classes.listTextItemMenu
                  )}
                >
                  Ajustes
                </Typography>
              }
            />
            {state.open_list & (state.menuValue === 'Ajustes') ? (
              <ExpandLess className={classes.expandMenu} />
            ) : (
              <ExpandMore className={classes.expandMenu} />
            )}
          </ListItem>
          {state.menuValue === 'Ajustes' && (
            <Collapse in={state.open_list} timeout="auto" unmountOnExit>
              <List component="div">
                <ListItem button component={Link} to={'/app/ajustes/portador'}>
                  {!state.open && (
                    <ListItemIcon className={classNames(classes.menuButton)}>
                      <span>AP</span>
                    </ListItemIcon>
                  )}
                  <ListItemText
                    inset
                    disableTypography
                    primary={
                      <Typography className={classes.listTextItem}>
                        <span>Portador</span>
                      </Typography>
                    }
                  />
                </ListItem>
                <ListItem button component={Link} to={'/app/ajustes/lojista'}>
                  {!state.open && (
                    <ListItemIcon className={classNames(classes.menuButton)}>
                      <span>AL</span>
                    </ListItemIcon>
                  )}
                  <ListItemText
                    inset
                    disableTypography
                    primary={
                      <Typography className={classes.listTextItem}>
                        <span>Lojista</span>
                      </Typography>
                    }
                  />
                </ListItem>
                <ListItem button component={Link} to={'/app/ajustes/lote'}>
                  {!state.open && (
                    <ListItemIcon className={classNames(classes.menuButton)}>
                      <span>AJL</span>
                    </ListItemIcon>
                  )}
                  <ListItemText
                    inset
                    disableTypography
                    primary={
                      <Typography className={classes.listTextItem}>
                        <span>Ajuste em lote</span>
                      </Typography>
                    }
                  />
                </ListItem>
                {permissoes.includes('Ajustes Relatorio') ? (
                  <ListItem
                    button
                    component={Link}
                    to={'/app/ajustes/relatorio-ajuste'}
                  >
                    {!state.open && (
                      <ListItemIcon className={classNames(classes.menuButton)}>
                        <span>RL</span>
                      </ListItemIcon>
                    )}
                    <ListItemText
                      inset
                      disableTypography
                      primary={
                        <Typography className={classes.listTextItem}>
                          <span>Relatório</span>
                        </Typography>
                      }
                    />
                  </ListItem>
                ) : null}
              </List>
            </Collapse>
          )}
          {permissoes.includes('Fidc') ? (
            <List>
              <ListItem button onClick={handleListOptions} id="fidc">
                <ListItemIcon className={classNames(classes.menuButton)}>
                  <GiTakeMyMoney style={iconMasterStyle} />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  primary={
                    <Typography
                      className={classNames(
                        classes.listTextItem,
                        classes.listTextItemMenu
                      )}
                    >
                      FIDC Iracema
                    </Typography>
                  }
                />
                {state.open_list & (state.menuValue === 'fidc') ? (
                  <ExpandLess className={classes.expandMenu} />
                ) : (
                  <ExpandMore className={classes.expandMenu} />
                )}
              </ListItem>
              {state.menuValue === 'fidc' && (
                <Collapse in={state.open_list} timeout="auto" unmountOnExit>
                  <List component="div">
                    <ListItem
                      button
                      component={Link}
                      to={'/app/fidc/importacao-manual'}
                    >
                      {!state.open && (
                        <ListItemIcon
                          className={classNames(classes.menuButton)}
                        >
                          <span>IM</span>
                        </ListItemIcon>
                      )}
                      <ListItemText
                        inset
                        disableTypography
                        primary={
                          <Typography className={classes.listTextItem}>
                            <span>Importação Manual</span>
                          </Typography>
                        }
                      />
                    </ListItem>
                    <ListItem
                      button
                      component={Link}
                      to={'/app/fidc/pagamento-rav'}
                    >
                      {!state.open && (
                        <ListItemIcon
                          className={classNames(classes.menuButton)}
                        >
                          <span>RM</span>
                        </ListItemIcon>
                      )}
                      <ListItemText
                        inset
                        disableTypography
                        primary={
                          <Typography className={classes.listTextItem}>
                            <span>Pagamento Rav</span>
                          </Typography>
                        }
                      />
                    </ListItem>
                    <ListItem
                      button
                      component={Link}
                      to={'/app/fidc/repasse-fundo'}
                    >
                      {!state.open && (
                        <ListItemIcon
                          className={classNames(classes.menuButton)}
                        >
                          <span>RT</span>
                        </ListItemIcon>
                      )}
                      <ListItemText
                        inset
                        disableTypography
                        primary={
                          <Typography className={classes.listTextItem}>
                            <span>Repasse Fundo</span>
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>
                </Collapse>
              )}
            </List>
          ) : null}
          {permissoes.includes('Cedentes') ? (
            <List>
              <ListItem button onClick={handleListOptions} id="cedente">
                <ListItemIcon className={classNames(classes.menuButton)}>
                  <GiArrowDunk style={iconMasterStyle} />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  primary={
                    <Typography
                      className={classNames(
                        classes.listTextItem,
                        classes.listTextItemMenu
                      )}
                    >
                      Cedentes bancarios
                    </Typography>
                  }
                />
                {state.open_list & (state.menuValue === 'cedente') ? (
                  <ExpandLess className={classes.expandMenu} />
                ) : (
                  <ExpandMore className={classes.expandMenu} />
                )}
              </ListItem>
              {state.menuValue === 'cedente' && (
                <Collapse in={state.open_list} timeout="auto" unmountOnExit>
                  <List component="div">
                    <ListItem
                      button
                      component={Link}
                      to={'/app/cedentes/importacao-manual-pier'}
                    >
                      {!state.open && (
                        <ListItemIcon
                          className={classNames(classes.menuButton)}
                        >
                          <span>IM</span>
                        </ListItemIcon>
                      )}
                      <ListItemText
                        inset
                        disableTypography
                        primary={
                          <Typography className={classes.listTextItem}>
                            <span>Importação Manual</span>
                          </Typography>
                        }
                      />
                    </ListItem>
                    <ListItem
                      button
                      component={Link}
                      to={'/app/cedentes/acompanhamento-cedente'}
                    >
                      {!state.open && (
                        <ListItemIcon
                          className={classNames(classes.menuButton)}
                        >
                          <span>AC</span>
                        </ListItemIcon>
                      )}
                      <ListItemText
                        inset
                        disableTypography
                        primary={
                          <Typography className={classes.listTextItem}>
                            <span>Acompanhamento cedente</span>
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>
                </Collapse>
              )}
            </List>
          ) : null}
          {permissoes.includes('Viagens') ? (
            <List>
              <ListItem button onClick={handleListOptions} id="viagem">
                <ListItemIcon className={classNames(classes.menuButton)}>
                  <GiReceiveMoney style={iconMasterStyle} />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  primary={
                    <Typography
                      className={classNames(
                        classes.listTextItem,
                        classes.listTextItemMenu
                      )}
                    >
                      Adiantamento
                    </Typography>
                  }
                />
                {state.open_list & (state.menuValue === 'viagem') ? (
                  <ExpandLess className={classes.expandMenu} />
                ) : (
                  <ExpandMore className={classes.expandMenu} />
                )}
              </ListItem>
              {state.menuValue === 'viagem' && (
                <Collapse in={state.open_list} timeout="auto" unmountOnExit>
                  <List component="div">
                    <ListItem
                      button
                      component={Link}
                      to={'/app/viagens/solicitacao-adiantamento'}
                    >
                      {!state.open && (
                        <ListItemIcon
                          className={classNames(classes.menuButton)}
                        >
                          <span>SA</span>
                        </ListItemIcon>
                      )}
                      <ListItemText
                        inset
                        disableTypography
                        primary={
                          <Typography className={classes.listTextItem}>
                            <span>Solicitação</span>
                          </Typography>
                        }
                      />
                    </ListItem>
                    <ListItem
                      button
                      component={Link}
                      to={'/app/viagens/listagem'}
                    >
                      {!state.open && (
                        <ListItemIcon
                          className={classNames(classes.menuButton)}
                        >
                          <span>AC</span>
                        </ListItemIcon>
                      )}
                      <ListItemText
                        inset
                        disableTypography
                        primary={
                          <Typography className={classes.listTextItem}>
                            <span>Acompanhamento</span>
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>
                </Collapse>
              )}
            </List>
          ) : null}
          {permissoes.includes('Cadoc') ? (
            <List>
              <ListItem button onClick={handleListOptions} id="cadoc">
                <ListItemIcon className={classNames(classes.menuButton)}>
                  <GiProcessor style={iconMasterStyle} />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  primary={
                    <Typography
                      className={classNames(
                        classes.listTextItem,
                        classes.listTextItemMenu
                      )}
                    >
                      Cadoc
                    </Typography>
                  }
                />
                {state.open_list & (state.menuValue === 'cadoc') ? (
                  <ExpandLess className={classes.expandMenu} />
                ) : (
                  <ExpandMore className={classes.expandMenu} />
                )}
              </ListItem>
              {state.menuValue === 'cadoc' && (
                <Collapse in={state.open_list} timeout="auto" unmountOnExit>
                  <List component="div">
                    <ListItem
                      button
                      component={Link}
                      to={'/app/cadoc/importacao'}
                    >
                      {!state.open && (
                        <ListItemIcon
                          className={classNames(classes.menuButton)}
                        >
                          <span>PC</span>
                        </ListItemIcon>
                      )}
                      <ListItemText
                        inset
                        disableTypography
                        primary={
                          <Typography className={classes.listTextItem}>
                            <span>Processamento CADOC</span>
                          </Typography>
                        }
                      />
                    </ListItem>
                    <ListItem
                      button
                      component={Link}
                      to={'/app/cadoc/conversao_4060'}
                    >
                      {!state.open && (
                        <ListItemIcon
                          className={classNames(classes.menuButton)}
                        >
                          <span>4060</span>
                        </ListItemIcon>
                      )}
                      <ListItemText
                        inset
                        disableTypography
                        primary={
                          <Typography className={classes.listTextItem}>
                            <span>Conversão 4060</span>
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>
                </Collapse>
              )}
            </List>
          ) : null}
          {permissoes.includes('Bancarizacao') ? (
            <List>
              <ListItem button onClick={handleListOptions} id="Bancarizacao">
                <ListItemIcon className={classNames(classes.menuButton)}>
                  <GiBank style={iconMasterStyle} />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  primary={
                    <Typography
                      className={classNames(
                        classes.listTextItem,
                        classes.listTextItemMenu
                      )}
                    >
                      Bancarizacao
                    </Typography>
                  }
                />
                {state.open_list & (state.menuValue === 'Bancarizacao') ? (
                  <ExpandLess className={classes.expandMenu} />
                ) : (
                  <ExpandMore className={classes.expandMenu} />
                )}
              </ListItem>
              {state.menuValue === 'Bancarizacao' && (
                <Collapse in={state.open_list} timeout="auto" unmountOnExit>
                  <List component="div">
                    <ListItem
                      button
                      component={Link}
                      to={'/app/bancarizacao/rotativo-bancarizacao'}
                    >
                      {!state.open && (
                        <ListItemIcon
                          className={classNames(classes.menuButton)}
                        >
                          <span>BR</span>
                        </ListItemIcon>
                      )}
                      <ListItemText
                        inset
                        disableTypography
                        primary={
                          <Typography className={classes.listTextItem}>
                            <span>Rotativo</span>
                          </Typography>
                        }
                      />
                    </ListItem>
                    <ListItem
                      button
                      component={Link}
                      to={'/app/bancarizacao/parcelado-bancarizacao'}
                    >
                      {!state.open && (
                        <ListItemIcon
                          className={classNames(classes.menuButton)}
                        >
                          <span>BP</span>
                        </ListItemIcon>
                      )}
                      <ListItemText
                        inset
                        disableTypography
                        primary={
                          <Typography className={classes.listTextItem}>
                            <span>Parcelado</span>
                          </Typography>
                        }
                      />
                    </ListItem>
                    <ListItem
                      button
                      component={Link}
                      to={'/app/bancarizacao/importacao-manual'}
                    >
                      {!state.open && (
                        <ListItemIcon
                          className={classNames(classes.menuButton)}
                        >
                          <span>IM</span>
                        </ListItemIcon>
                      )}
                      <ListItemText
                        inset
                        disableTypography
                        primary={
                          <Typography className={classes.listTextItem}>
                            <span>Importacao Manual</span>
                          </Typography>
                        }
                      />
                    </ListItem>
                    <ListItem
                      button
                      component={Link}
                      to={'/app/bancarizacao/historico-ccbs'}
                    >
                      {!state.open && (
                        <ListItemIcon
                          className={classNames(classes.menuButton)}
                        >
                          <span>HC</span>
                        </ListItemIcon>
                      )}
                      <ListItemText
                        inset
                        disableTypography
                        primary={
                          <Typography className={classes.listTextItem}>
                            <span>Historico CCBS</span>
                          </Typography>
                        }
                      />
                    </ListItem>
                    <ListItem
                      button
                      component={Link}
                      to={'/app/bancarizacao/importacao-rejeicao'}
                    >
                      {!state.open && (
                        <ListItemIcon
                          className={classNames(classes.menuButton)}
                        >
                          <span>IMP</span>
                        </ListItemIcon>
                      )}
                      <ListItemText
                        inset
                        disableTypography
                        primary={
                          <Typography className={classes.listTextItem}>
                            <span>Importação Rejeção</span>
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>
                </Collapse>
              )}
            </List>
          ) : null}
          {permissoes.includes('Faturamento') ? (
            <List>
              <ListItem button onClick={handleListOptions} id="Faturamento">
                <ListItemIcon className={classNames(classes.menuButton)}>
                  <GiCash style={iconMasterStyle} />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  primary={
                    <Typography
                      className={classNames(
                        classes.listTextItem,
                        classes.listTextItemMenu
                      )}
                    >
                      Faturamento
                    </Typography>
                  }
                />
                {state.open_list & (state.menuValue === 'Faturamento') ? (
                  <ExpandLess className={classes.expandMenu} />
                ) : (
                  <ExpandMore className={classes.expandMenu} />
                )}
              </ListItem>
              {state.menuValue === 'Faturamento' && (
                <Collapse in={state.open_list} timeout="auto" unmountOnExit>
                  <List component="div">
                    <ListItem
                      button
                      component={Link}
                      to={'/app/faturamento/transacao-fatura'}
                    >
                      {!state.open && (
                        <ListItemIcon
                          className={classNames(classes.menuButton)}
                        >
                          <span>FT</span>
                        </ListItemIcon>
                      )}
                      <ListItemText
                        inset
                        disableTypography
                        primary={
                          <Typography className={classes.listTextItem}>
                            <span>Transação Fatura</span>
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>
                </Collapse>
              )}
            </List>
          ) : null}
          {permissoes.includes('Fortpagamento') ? (
            <List>
              <ListItem button onClick={handleListOptions} id="Fortpagamento">
                <ListItemIcon className={classNames(classes.menuButton)}>
                  <FaStoreAlt style={iconMasterStyle} />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  primary={
                    <Typography
                      className={classNames(
                        classes.listTextItem,
                        classes.listTextItemMenu
                      )}
                    >
                      Faturamento
                    </Typography>
                  }
                />
                {state.open_list & (state.menuValue === 'Fortpagamento') ? (
                  <ExpandLess className={classes.expandMenu} />
                ) : (
                  <ExpandMore className={classes.expandMenu} />
                )}
              </ListItem>
              {state.menuValue === 'Fortpagamento' && (
                <Collapse in={state.open_list} timeout="auto" unmountOnExit>
                  <List component="div">
                    <ListItem
                      button
                      component={Link}
                      to={'/app/fortpagamento/historico-fortpagamento'}
                    >
                      {!state.open && (
                        <ListItemIcon
                          className={classNames(classes.menuButton)}
                        >
                          <span>RL</span>
                        </ListItemIcon>
                      )}
                      <ListItemText
                        inset
                        disableTypography
                        primary={
                          <Typography className={classes.listTextItem}>
                            <span>Repasse Lojista</span>
                          </Typography>
                        }
                      />
                    </ListItem>

                    <ListItem
                      button
                      component={Link}
                      to={'/app/fortpagamento/importacao-manual'}
                    >
                      {!state.open && (
                        <ListItemIcon
                          className={classNames(classes.menuButton)}
                        >
                          <span>IM</span>
                        </ListItemIcon>
                      )}
                      <ListItemText
                        inset
                        disableTypography
                        primary={
                          <Typography className={classes.listTextItem}>
                            <span>Importação Manual</span>
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>
                </Collapse>
              )}
            </List>
          ) : null}

          {permissoes.includes('Lastro Iracema') ? (
            <List>
              <ListItem button onClick={handleListOptions} id="Lastro Iracema">
                <ListItemIcon className={classNames(classes.menuButton)}>
                  <FaFileInvoiceDollar style={iconMasterStyle}/>
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  primary={
                    <Typography
                      className={classNames(
                        classes.listTextItem,
                        classes.listTextItemMenu
                      )}
                    >
                      Lastro - Fidc Iracema II
                    </Typography>
                  }
                />
                {state.open_list & (state.menuValue === 'Fortpagamento') ? (
                  <ExpandLess className={classes.expandMenu} />
                ) : (
                  <ExpandMore className={classes.expandMenu} />
                )}
              </ListItem>
              {state.menuValue === 'Lastro Iracema' && (
                <Collapse in={state.open_list} timeout="auto" unmountOnExit>
                  <List component="div">
                    <ListItem
                      button
                      component={Link}
                      to={'/app/lastro-iracema/faturas'}
                    >
                      {!state.open && (
                        <ListItemIcon
                          className={classNames(classes.menuButton)}
                        >
                          <span>FA</span>
                        </ListItemIcon>
                      )}
                      <ListItemText
                        inset
                        disableTypography
                        primary={
                          <Typography className={classes.listTextItem}>
                            <span>Faturas</span>
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>
                </Collapse>
              )}
            </List>
          ) : null}
          {permissoes.includes('Syspag')
            ? (<List>
              <ListItem button onClick={handleListOptions} id='syspag'>
                <ListItemIcon className={classNames(classes.menuButton)}>
                  <GiPayMoney style={iconMasterStyle}/>
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  primary={
                    <Typography
                      className={classNames(
                        classes.listTextItem,
                        classes.listTextItemMenu
                      )}
                    >
                      Syspag
                    </Typography>
                  }
                />
                {state.open_list & (state.menuValue === 'syspag') ? (
                  <ExpandLess className={classes.expandMenu} />
                ) : (
                  <ExpandMore className={classes.expandMenu} />
                )}
              </ListItem>
              {state.menuValue === 'syspag' && (
                <Collapse in={state.open_list} timeout='auto' unmountOnExit>
                  <List component='div'>
                    <ListItem
                      button
                      component={Link}
                      to={'/app/syspag/importacao-manual'}
                    >
                      {!state.open && (
                        <ListItemIcon className={classNames(classes.menuButton)}>
                          <span>IM</span>
                        </ListItemIcon>
                      )}
                      <ListItemText
                        inset
                        disableTypography
                        primary={
                          <Typography className={classes.listTextItem}>
                            <span>Importação Retorno</span>
                          </Typography>
                        }
                      />
                    </ListItem>
                    {/* <ListItem
                      button
                      component={Link}
                      to={'/app/syspag/remessa'}
                    >
                      {!state.open && (
                        <ListItemIcon className={classNames(classes.menuButton)}>
                          <span>RM</span>
                        </ListItemIcon>
                      )}
                      <ListItemText
                        inset
                        disableTypography
                        primary={
                          <Typography className={classes.listTextItem}>
                            <span>Remessa</span>
                          </Typography>
                        }
                      />
                    </ListItem> */}
                    <ListItem
                      button
                      component={Link}
                      to={'/app/syspag/retorno'}
                    >
                      {!state.open && (
                        <ListItemIcon className={classNames(classes.menuButton)}>
                          <span>AC</span>
                        </ListItemIcon>
                      )}
                      <ListItemText
                        inset
                        disableTypography
                        primary={
                          <Typography className={classes.listTextItem}>
                            <span>Acompanhamento</span>
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>
                </Collapse>
              )}
            </List>
            ) : null }
          {permissoes.includes('Recebiveis') ? (
            <List>
              <ListItem button onClick={handleListOptions} id="fidc">
                <ListItemIcon className={classNames(classes.menuButton)}>
                  <FaCashRegister style={iconMasterStyle} />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  primary={
                    <Typography
                      className={classNames(
                        classes.listTextItem,
                        classes.listTextItemMenu
                      )}
                    >
                      Recebíveis
                    </Typography>
                  }
                />
                {state.open_list & (state.menuValue === 'recebiveis') ? (
                  <ExpandLess className={classes.expandMenu} />
                ) : (
                  <ExpandMore className={classes.expandMenu} />
                )}
              </ListItem>
              {state.menuValue === 'recebiveis' && (
                <Collapse in={state.open_list} timeout="auto" unmountOnExit>
                  <List component="div">
                    <ListItem
                      button
                      component={Link}
                      to={'/app/recebiveis/registro-recebiveis'}
                    >
                      {!state.open && (
                        <ListItemIcon
                          className={classNames(classes.menuButton)}
                        >
                          <span>RG</span>
                        </ListItemIcon>
                      )}
                      <ListItemText
                        inset
                        disableTypography
                        primary={
                          <Typography className={classes.listTextItem}>
                            <span>Registro</span>
                          </Typography>
                        }
                      />
                    </ListItem>
                    <ListItem
                      button
                      component={Link}
                      to={'/app/recebiveis/informe-liquidacao'}
                    >
                      {!state.open && (
                        <ListItemIcon
                          className={classNames(classes.menuButton)}
                        >
                          <span>LIQ</span>
                        </ListItemIcon>
                      )}
                      <ListItemText
                        inset
                        disableTypography
                        primary={
                          <Typography className={classes.listTextItem}>
                            <span>Liquidação</span>
                          </Typography>
                        }
                      />
                    </ListItem>
                    <ListItem
                      button
                      component={Link}
                      to={'/app/recebiveis/contratos'}
                    >
                      {!state.open && (
                        <ListItemIcon
                          className={classNames(classes.menuButton)}
                        >
                          <span>CT</span>
                        </ListItemIcon>
                      )}
                      <ListItemText
                        inset
                        disableTypography
                        primary={
                          <Typography className={classes.listTextItem}>
                            <span>CONTRATOS</span>
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>
                </Collapse>
              )}
            </List>
          ) : null}
        </List>
      ) : null}
      <Divider />
    </div>
  )
}

export default modulos
