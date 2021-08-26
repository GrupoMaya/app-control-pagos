
import { useState, useContext } from 'react'
import { Modal } from 'antd'

import { AppContext } from 'context/AppContextProvider'
import HookNameProjectById from 'hooks/HookNameProjectById'
import ModalPagosClient from './ModalPagosClient'
import TablaPagosClient from './TablaPagosClient'
import ModalStatusProjectDetails from './ModalStatusProjectDetails'

import NumberFormat from 'utils/NumberFormat'

const TablaClienteInfo = ({ cliente, lotes, pagos }) => {

  const [expediente, setExpediente] = useState(false)
  const handleModal = () => setExpediente(!expediente)

  const [projectStatus, SetprojectStatus] = useState(false)
  const [loteId, setLoteId] = useState()
  const handledProjectStatus = () => SetprojectStatus(!projectStatus)

  const handleLoteModal = (loteId) => {
    setLoteId(loteId)
    handledProjectStatus()
  }

  const { openModalPago, handleModalPago } = useContext(AppContext)

  return (
    <>
      {/* Modal para añadir pago */}
      <ModalPagosClient 
        openModalPago={openModalPago} 
        handledOpen={handleModalPago}
        lotes={lotes} 
        pagos={pagos}
        />

        {/* expediente de cliente */}
        <Modal
          title="Expediente del Cliente"
          visible={expediente}
          onCancel={handleModal}
          footer={null}
        >
          <div className="expediente__data">
              <section>
                  <p>Nombre:</p>
                  {cliente && cliente.nombre}
              </section>
              <section>
                  <p>DIRRECCIÓN</p>
                  {cliente && cliente.address}
              </section>
              <section>
                  <p>Teléfono</p>
                  {cliente && cliente.phone}
              </section>
              <section>
                  <p>Email</p>
                  {cliente && cliente.email}
              </section>
          </div>
        </Modal>

        <ModalStatusProjectDetails 
          openModal={ projectStatus } 
          handledModal={ handledProjectStatus }
          loteid={loteId}
        />

      <section className="cliente__App__header">
      <h4>{ cliente && cliente.nombre }</h4>
      </section>
      <section className="cliente__App__body">
              <button onClick={handleModal}>
                  Ver Expediente
              </button>
          <div>
            {
              <section className="proyecto__table">
                <h3>Proyectos</h3>
              <table>
                <thead>
                <tr className="head__data__table">
                  <th>Proyecto</th>
                  <th>Lote</th>
                  <th>Manzana</th>
                  <th>Plazo</th>
                  <th>Mensualidad</th>
                  <th>Enganche</th>
                  <th>Financiamiento</th>
                  <th>Precio Total</th>
                </tr>
                </thead>
                <tbody>
                  {
                  lotes
                    .map((lote) => {
                      const { project, loading } = HookNameProjectById({ id: lote.proyecto })
                      return (
                        <tr 
                          key={lote._id} 
                          className="tabla__data"
                          onClick={() => handleLoteModal(lote._id)}
                          >
                            <td>{ loading && project?.title }</td>
                            <td>{ lote.lote }</td>
                            <td>{ lote.manzana }</td>
                            <td>{ lote.plazo }</td>
                            <td>{ <NumberFormat number={lote.mensualidad} /> }</td>
                            <td>{ <NumberFormat number={lote.enganche} /> }</td>                             
                            <td>{ <NumberFormat number={lote.financiamiento} /> }</td>                             
                            <td>{ <NumberFormat number={lote.precioTotal} /> }</td>                             
                          </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </section>
            }
          </div>
            <TablaPagosClient pagos={pagos} />
      </section>
    </>
  )
}

export default TablaClienteInfo
