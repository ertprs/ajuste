import React, { useEffect, useState } from 'react'
import TitlePage from '../../../components/title'
import DataTableAdiantamentoHistorico from '../components/data-table-adiantamento'
import Api from '../../../services/Api'
import Swal from 'sweetalert2'
import './style.css'

export default function listagem (props) {
  const [data, setData] = useState([])
  const [dataLocation, setDataLocation] = useState([])

  useEffect(() => {
    const getAdvanced = async () => {
      try {
        const response = await Api.get('viagens/advanced/')
        setData(response.data)
      } catch (error) {
        console.log(error)
        Swal.fire({
          title: 'Error',
          type: 'error',
          text: 'Não foi possivel buscar a listagem dos adiantamentos'
        })
      }
    }
    const getlocation = async () => {
      try {
        const response = await Api.get('viagens/locations/')
        setDataLocation(response.data)
      } catch (error) {
        console.log(error)
        Swal.fire({
          title: 'Error',
          type: 'error',
          text: 'Não foi possivel buscar a listagem dos adiantamentos'
        })
      }
    }
    getAdvanced()
    getlocation()
  }, [])

  return (
    <>
        <TitlePage text={'Acompanhamento de Adiantamento'} />
        <div className={'principal'}>
          <DataTableAdiantamentoHistorico data={data} dataLocation={dataLocation} />
        </div>
    </>
  )
}
