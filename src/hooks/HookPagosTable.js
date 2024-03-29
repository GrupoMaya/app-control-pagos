
import { useEffect, useContext, useState } from 'react'
import { useMachine } from '@xstate/react'
import { AppContext } from 'context/AppContextProvider'

import BuscadorMachine from 'context/BuscadorMachine'
import NumberFormat from 'utils/NumberFormat'
import DateIntlFormat from 'utils/DateIntlFormat'

import { saveAs } from 'file-saver'
import { baseURL } from 'context/controllers'

import DetallePago from 'Models/DetallePago'
import UpdateModal from 'Modales/UpdateModal/UpdateModal'

import { UserState } from 'context/userContext'

const HookPagosTable = ({ pagoId, lote }) => {
  
  const [state, send] = useMachine(BuscadorMachine)
  useEffect(() => {
    send('GET_INFO_PAGO', { id: pagoId })
  }, [pagoId])

  const [openDetalle, setOpenDetalle] = useState(false)
  const handledDetalle = () => setOpenDetalle(!openDetalle)

  const { setModalPago, setIdPago } = useContext(AppContext)
  const handlePagador = (idPago) => {
    setModalPago(true)
    setIdPago(idPago)
  }

  const pdfCreator = ({ data } = {}) => {
    // preview pdf blob data
    fetch(`${baseURL}/pdf?folio=${data._id}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(data)
    }).then(res => {
      return res
        .arrayBuffer()
        .then(res => {
          const blob = new Blob([res], { type: 'application/pdf' })
          saveAs(blob, `${data.dataClient[0].nombre}_Folio_${data.folio}.pdf`)
        })
        .catch(error => console.log(error))
    })
  }

  const { pago } = state.context

  const [pdfPreview, setPdfPreview] = useState(null)
  const previewURL = async (data) => {
    return new Promise((resolve, reject) => {
      // pdf blob preview url react pdf viewer
      fetch(`${baseURL}/pdf?folio=${data._id}`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(data)
      })
        .then((res) => {
          res.arrayBuffer()
            .then(res => {
              const blob = new Blob([res], { type: 'application/pdf' })
              const URLpreview = URL.createObjectURL(blob)
              setPdfPreview(URLpreview)
            })
        })
        .finally(() => handledDetalle())
    })
    
  }

  const { state: contextUser } = UserState()
  const { user: userState } = contextUser.context

  return (
    state.matches('success') && pago
      .filter((pago) => {
        return pago.dataLote[0]?.lote === lote
      })
      .map((pago) => {
        
        const idPago = pago._id

        let tipoPagoClass = 'tag__normal'
        switch (pago.tipoPago) {
          case 'extra':
            tipoPagoClass = 'tag__extra'
            break
          case 'acreditado':
            tipoPagoClass = 'tag__acreditado'
            break
          case 'saldoinicial':
            tipoPagoClass = 'tag__saldoinicial'
            break
        }

        return (
          <>
            <tr
              key={pago._id}
              id='row_info_pago'
              className='tabla__data'
              >
                <td>{pago.folio}</td>
                <td><DateIntlFormat date={pago.mes} type='numeric'/></td>
                <td
                  className={ pago.status ? 'tabla__data__pagado' : 'tabla__data__pendding' }
                >
                  { pago.status ? 'Pagado' : 'Pendiente' }
                </td>
                <td>{ pago.refPago }</td>
                <td><span className={tipoPagoClass}>{ pago.tipoPago }</span></td>
                <td>{ <NumberFormat number={ pago.mensualidad.$numberDecimal || pago.mensualidad } />}</td>
                <td className='estatus__menu'>
                    { userState?.role === 'admin' && <button disabled={pago.status} onClick={() => handlePagador(pago._id)}>PAGAR</button>}
                    <button disabled={!pago.status} onClick={() => previewURL(pago)}>Vista previa</button>
                    <button style={{ backgroundColor: '#0C4C7D' }} disabled={!pago.status} onClick={() => pdfCreator({ data: pago })}>Descargar</button>
                   <UpdateModal id={idPago} document="Pago"/>
                  </td>
                <small style={{ color: '#bdc3c7' }}>{pago._id}</small>
              </tr>
              <DetallePago
                visible={openDetalle}
                onCancel={handledDetalle}
                pdfURL={pdfPreview}
              />
          </>
        )
      })
  )
}

export default HookPagosTable
