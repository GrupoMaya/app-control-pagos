import { useEffect, useState } from 'react'
import { baseURL } from 'context/controllers'
import { Modal } from 'antd'

import NumberFormat from 'utils/NumberFormat'

const ModalStatusProjectDetails = ({ loteid, openModal, handledModal }) => {

  const idLote = loteid.length > 0 && loteid[0].lote.toString()

  const [estatus, setEstus] = useState([])
  const [loading, setLoading] = useState(false)
    
  const statusPagosPendiente = (payload) => {
    const plazo = payload[0]?.plazo
    
    const folioArray = payload[0]?.pagos.map(pago => pago.folio)
    const totalPagos = Array.isArray(folioArray) && Math.max(...folioArray)
    
    const diffPagos = plazo - totalPagos
    
    const pendiente = payload[0]?.pagos.filter(item =>
      item.status === false &&
      item.tipoPago !== 'extra' &&
      item.tipoPago !== 'saldoinicial').length
      
    return { totalPagos, plazo, diffPagos, pendiente }
  }

  const financiamientoPendiente = (payload) => {
    const financiamiento = payload[0]?.precioTotal
    
    const pagoRealizado = payload[0]?.pagos
      .filter(item => item.status === true && item.tipoPago !== 'extra')
      .map(item => item.mensualidad)
      .reduce((acc, val) => +acc + +val, [])
    
    const intereses = payload[0]?.pagos
      .filter(item => item.status === true && item.tipoPago === 'extra')
      .map(item => item.mensualidad)
      .reduce((acc, val) => +acc + +val, [])
            
    const pagoPorRealizar = payload[0]?.pagos
      .filter(item => item.status === false)
      .map(item => item.mensualidad)
      .reduce((acc, val) => +acc + +val, [])

    const restante = financiamiento - pagoRealizado
    
    return { financiamiento, pagoRealizado, pagoPorRealizar, restante, intereses }
  }

  const plazoStatus = statusPagosPendiente(estatus)
  const financiamento = financiamientoPendiente(estatus)
    
  useEffect(() => {
    fetch(`${baseURL}/status/payment/lote/${idLote}`)
      .then(res => res.json())
      .then(res => setEstus(res.message))
      .finally(() => setLoading(true))
  }, [loteid])
    
  return (
      <Modal
        title="RESUMEN DE PAGOS"
        visible={openModal}
        onCancel={handledModal}
        footer={null}
         width={'40%'}

      >
      {
        loading &&
      <section >
      <table className="tabla__edo__pagos">
        <thead title="Estados de pagos">
          <h3>Pagos</h3>
          <tr>
            <th>Plazo</th>
            <th>Realizados</th>
            <th>Restantes</th>
          </tr>
        </thead>
        <tbody>
        <tr>
          <td>{ plazoStatus?.plazo }</td>
          <td>{ plazoStatus?.totalPagos }</td>
          <td>{ plazoStatus?.diffPagos }</td>
        </tr>
        </tbody>
      </table>
        <h3 style={{ fontWeight: 'bold', fontSize: '1rem' }}>Financiamiento</h3>
        <div>
          <div className='tabla_resumen'>
            <span>Total: </span>
            <span>{ NumberFormat({ number: financiamento?.financiamiento })}</span>
          </div>
          <div className='tabla_resumen'>
            <span>Total, pagos realizado: </span>
            <span>{ NumberFormat({ number: financiamento?.pagoRealizado })}</span>
          </div>
          <div className='tabla_resumen'>
            <span>Intereses generados: </span>
            <span>{ NumberFormat({ number: financiamento?.intereses })}</span>
          </div>
          <div className='tabla_resumen'>
            <span>Pagos pendientes: </span>
            <span>{ NumberFormat({ number: financiamento?.pagoPorRealizar })}</span>
          </div>
          <div className='tabla_resumen'>
            <span>Total por pagar: </span>
            <span>{ NumberFormat({ number: financiamento?.restante })}</span>
          </div>
        </div>
      </section>
      }
      </Modal>
  )
}

export default ModalStatusProjectDetails
