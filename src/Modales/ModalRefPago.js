import { useMemo, useState } from 'react'
import { Modal } from 'antd'
import DateIntlForma from 'utils/DateIntlFormat'
import NumberFormat from 'utils/NumberFormat'

const ModalRefPago = ({ visible, onCancel, dataResult }) => {
  const { refPagoMatch } = dataResult?.context

  const [message, setMessage] = useState(null)

  const pagoObject = {
    cliente_data: {},
    lote_data: {},
    proyecto_data: {},
    mensualidad: null,
    tipoPago: null,
    banco: null,
    refBanco: null,
    ctaBancaria: null,
    fechaPago: null,
    mes: null,
    folio: null
  }

  const dataMatchResult = useMemo(() => {
    const refMatch = refPagoMatch || []

    if (refMatch.map(item => item).length > 0) {
      setMessage(null)
      return refMatch
    } else if (refMatch.map(item => item).length === 0) {
      setMessage('No se encontraron resultados')
      return []
    }

    return pagoObject
  }, [dataResult.value])

  const tipoPago = {
    saldoinicial: 'Saldo Incial',
    mensualidad: 'Mensualidad',
    extra: 'Extra'
  }
  
  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      title="Resultados de referencia de pago"
      footer={null}
    >
    <div className="container">
      {
        message && <p className="error__message">{message}</p>
      }
      {
        dataMatchResult.length > 0 && dataMatchResult.map(pago => {
          return (
            <div className="modal__search__users" key={pago._id}>
            <p>Nombre: { pago.cliente_data[0]?.nombre }</p>
            <p>Proyecto: { pago.proyecto_data[0]?.title}</p>
            <p>Lote: { pago.lote_data[0]?.lote}</p>
            { pago.lote_data[0].manzana !== '' && <p>Manzana: { pago.lote_data[0].manzana }</p> }
            <p>Folio: { pago.folio }</p>
            <p>Pago: { NumberFormat({ number: pago.mensualidad }) }</p>
            <p>Tipo de pago: { tipoPago[pago.tipoPago] }</p>
            <p>Banco: { pago.banco }</p>
            <p>Referencia bancaria: { pago.refBanco }</p>
            <p>Cuenta bancaria: { pago.ctaBancaria }</p>
            { pago.fechaPago && <p>Fecha de pago: { DateIntlForma({ date: pago.fechaPago }) }</p>}
            <br/>
          <hr/>
          </div>
          )
        })
      }
    </div>
    </Modal>
  )
}

export default ModalRefPago
