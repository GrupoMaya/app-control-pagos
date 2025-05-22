import { useEffect, useState, useContext, useCallback } from 'react'

import { AppContext } from 'context/AppContextProvider'
import ModalPagosClient from 'Components/ModalPagosClient'

import { useMachine } from '@xstate/react'
import BuscadorMachine from 'context/BuscadorMachine'
import { useMayaDispatch } from 'context/MayaMachine'
import NumberFormat from 'utils/NumberFormat'
import TablaPagosClient from 'Components/TablaPagosClient'
import ModalStatusProjectDetails from 'Components/ModalStatusProjectDetails'
import DateIntlForma from 'utils/DateIntlFormat'
import ValuesByDocument from 'hooks/ValuesByDocument'
import { Redirect } from 'react-router-dom'

const ClienteFluid = ({ match, location }) => {
  const dataQuery = location.state
  if (typeof dataQuery === 'undefined') {
    return <Redirect to={'/'}></Redirect>
  }

  // const [openExpediente, setOpenExpediente] = useState(false)
  // const toogleExpediente = () => setOpenExpediente(!openExpediente)
  
  const [state, send] = useMachine(BuscadorMachine)
  const { openModalPago, handleModalPago } = useContext(AppContext)
  
  const [modalPagoDetalles, setModalPagoDetalles] = useState(false)
  const tooglePagoDetalles = () => setModalPagoDetalles(!modalPagoDetalles)
  const { setXstateQuery } = useMayaDispatch()
  useEffect(() => {
    const query = {
      idProject: dataQuery[0].proyecto.toString(),
      clientID: dataQuery[0].cliente.toString(),
      loteID: dataQuery[0]._id.toString()
    }
    console.log(dataQuery)
    send('GET_PAGOS_BY_PROJECT', { query })
    // guardamos la query para poder actualizar el estado de la maquina padre
    setXstateQuery({ query, send })
  }, [])
  
  const { clienteSlug, projectSlug, idlote } = match.params
  const { pagos } = state.context
  const nombreProyecto = <ValuesByDocument id={ projectSlug } documentType="Proyecto" cbValue='title' />

  const downloadResumenExcel = useCallback(async () => {
    send('GET_RESUMEN_EXCEL', {
      query: {
        idProject: dataQuery[0].proyecto.toString(),
        clientID: dataQuery[0].cliente.toString()
      }
    })
  }, [])
  console.log(downloadResumenExcel)
        
  return (
    <div className="cliente__App__container">
      <section className="cliente__App__header">
      <h4>
        { `${clienteSlug}`}
        <hr />
        { nombreProyecto }
      </h4>
      </section>
        <section className="cliente__App__body">
        <div>
          <section className="proyecto__table">
          <a
            onClick={() => tooglePagoDetalles()}
            >
            <h3>Información del lote</h3>
          </a>
        <table>
          <thead>
          <tr className="head__data__table">
            <th>Proyecto</th>
            <th>Lote</th>
            <th>Manzana</th>
            <th>Inicio Contrato</th>
            <th>Plazo</th>
            <th>Mensualidad</th>
            <th>Enganche</th>
            <th>Financiamiento</th>
            <th>Precio Total</th>
          </tr>
          </thead>
          <tbody>
            {
              Boolean(location?.state) &&
                location?.state.map((lote) => {
                  return (
                    <tr
                      key={lote?._id}
                      className="tabla__data"
                      >
                        <td>{ nombreProyecto }</td>
                        <td>{ lote?.lote }</td>
                        <td>{ lote?.manzana }</td>
                        <td>{ lote?.inicioContrato && <DateIntlForma date={lote.inicioContrato} /> }</td>
                        <td>{ lote?.plazo }</td>
                        <td>{ <NumberFormat number={lote?.mensualidad} /> }</td>
                        <td>{ <NumberFormat number={lote?.enganche} /> }</td>
                        <td>{ <NumberFormat number={lote?.financiamiento} /> }</td>
                        <td>{ <NumberFormat number={lote?.precioTotal} /> }</td>
                      </tr>
                  )
                })
            }
          </tbody>
        </table>
      </section>
        </div>
        <section>
          { state.matches('success') &&
            <TablaPagosClient
              pagos={pagos}
              lote={idlote}
              clienteInfo={{ clienteSlug, proyecto: nombreProyecto, idlote }}
              downloadResumenExcel={downloadResumenExcel}
            />
          }
        </section>
        </section>
        <ModalPagosClient
          openModalPago={openModalPago}
          handledOpen={handleModalPago}
          lotes={dataQuery}
        />
      <ModalStatusProjectDetails
        openModal={modalPagoDetalles}
        handledModal={tooglePagoDetalles}
        loteid={pagos}
      />
    </div>
  )
}
export default ClienteFluid
