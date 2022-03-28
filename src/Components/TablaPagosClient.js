import { useContext, useState, useEffect } from 'react'
import { AppContext } from 'context/AppContextProvider'

import HookPagosTable from 'hooks/HookPagosTable'
import ModalEstatus from './ModalEstatus'
import XLSX from 'xlsx'

const TablaPagosClient = ({ pagos: pagosData, lote, clienteInfo }) => {
  
  const { modalPago, setModalPago } = useContext(AppContext)
  const [pagosSelected, setPagosSelected] = useState('all')
  const [pagos, setPagos] = useState(pagosData)

  useEffect(() => {
    setPagos(
      pagosData.filter(pago => {
        if (pagosSelected === 'all') {
          return pago
        }
        return pago.tipoPago === pagosSelected
      })
    )
  }, [pagosSelected])

  const exportExcel = () => {

    if (pagos.length === 0) {
      return
    }
    
    const payloadToExport = pagos.map(pago => {
      return {
        Fecha: pago.mes,
        pago: pago.mensualidad,
        Tipo_pago: pago.tipoPago,
        Numero_pago: pago.folio,
        cuenta: pago.ctaBancaria,
        fecha_deposito: pago.fechaPago,
        Referencia_Banco: pago.refBanco,
        Observaciones: `${pago.textoObservaciones || ''} ${pago.refPago || ''} ${pago.mensajeRecibo || ''}`
      }
    })

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(payloadToExport)
    XLSX.utils.book_append_sheet(wb, ws, 'Pagos')
    XLSX.writeFile(wb, `pagos_${lote}_${clienteInfo.clienteSlug}.xlsx`)
  }

  return (
    <section className="cliente__App__pagos">
      <h3> PAGOS </h3>
      <section className="proyecto__table">
        {/* Modal para agreagar un pago a la deuda */}
      <nav className='botonera'>
        <ul className='linkExcel'>
          <li>
            <button
              onClick={() => exportExcel()}
            >
              Exportar Lista
            </button>
          </li>
        </ul>
      </nav>
      <ModalEstatus
        openModal={modalPago}
        handledStatusPago={setModalPago}
        />

      <table>
        <thead>
        <tr className="head__data__table">
          <th>Folio</th>
          <th>Fecha</th>
          <th>Estatus</th>
          <th>Referencia</th>
          <th>
            <select
              className='select_gde'
              style={{ fotWeight: 'bold' }}
              onChange={(e) => setPagosSelected(e.target.value)}>
                <option value="all">Todos</option>
                <option value='mensualidad'>Mensualidad</option>
                <option value='extra'>Extra</option>
                <option value='saldoinicial'>Saldo Inicial</option>
            </select>
          </th>
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
          {
            Object.values(pagos).length === 0 && <tr><td colSpan="7">No hay pagos registrados</td></tr>
          }
        </tbody>
      </table>
      </section>
    </section>
  )

}

export default TablaPagosClient
