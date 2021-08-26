import { useContext } from 'react'
import { AppContext } from 'context/AppContextProvider'

import HookPagosTable from 'hooks/HookPagosTable'
import ModalEstatus from './ModalEstatus'

const TablaPagosClient = ({ pagos, lote }) => {
  const { modalPago, setModalPago } = useContext(AppContext)

  return (
    <section className="cliente__App__pagos">
      <h3> PAGOS </h3>
      <section className="proyecto__table">

        {/* Modal para agreagar un pago a la deuda */}
      <ModalEstatus 
        openModal={modalPago} 
        handledStatusPago={setModalPago} 
        />

      <table>
        <thead>
        <tr className="head__data__table">
          <th>Mes</th>
          <th>Estatus</th>
          <th>Poyecto</th>
          <th>Lote</th>
          <th>Referencia</th>
          <th>Tipo</th>
          <th>Pago</th>
          <th>Acciones</th>
        </tr>
        </thead>
        <tbody>
          {
            Object.values(pagos)
              .map(pagos => {
                return (
                  <HookPagosTable key={pagos._id} pagoId={pagos._id} lote={lote}/>
                )
              })
          }
        </tbody>
      </table>
      </section>
    </section>
  )

}

export default TablaPagosClient
