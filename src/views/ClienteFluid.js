import { useEffect, useState, useContext } from 'react'

import { AppContext } from 'context/AppContextProvider'
import ModalPagosClient from 'Components/ModalPagosClient'

import { useMachine } from '@xstate/react'
import BuscadorMachine from 'context/BuscadorMachine'
// import ModalExpediente from 'Modales/ModalExpediente'
import NumberFormat from 'utils/NumberFormat'
import TablaPagosClient from 'Components/TablaPagosClient'
import ModalStatusProjectDetails from 'Components/ModalStatusProjectDetails'
import DateIntlForma from 'utils/DateIntlFormat'
import ValuesByDocument from 'hooks/ValuesByDocument'

const ClienteFluid = ({ match, location }) => {

  const [openExpediente, setOpenExpediente] = useState(false)
  const toogleExpediente = () => setOpenExpediente(!openExpediente)

  const [state, send] = useMachine(BuscadorMachine)
  const { openModalPago, handleModalPago } = useContext(AppContext)

  const [modalPagoDetalles, setModalPagoDetalles] = useState(false)
  const tooglePagoDetalles = () => setModalPagoDetalles(!modalPagoDetalles)

  const dataQuery = location.state
  console.log({ esado: location.state })
  useEffect(() => {
    const query = {
      idProject: dataQuery[0].proyecto.toString(),
      clientID: dataQuery[0].cliente.toString()
    }    
    send('GET_PAGOS_INFO', { query })
  }, [])

  const { clienteSlug, projectSlug, idlote } = match.params
  const { pagos } = state.context 
  const nombreProyecto = <ValuesByDocument id={ projectSlug } documentType="Proyecto" cbValue='title' />
      
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
          <button
            onClick={() => toogleExpediente()}
          >
              Ver Expediente
          </button>
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
            location?.state
              .map((lote) => {
                console.log(lote)              
                return (
                  <tr 
                    key={lote._id} 
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
          { state.matches('success') && <TablaPagosClient pagos={pagos} lote={idlote}/> }
        </section>
        </section>
        {/* TODO SE ROMPIO */}
        {/* <ModalExpediente 
          visible={openExpediente}
          onCancel={toogleExpediente}
          cliente={location.state}
        /> */}
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
