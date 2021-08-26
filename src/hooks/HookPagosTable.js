
import { useEffect, useContext, useState } from 'react'
import { useMachine } from '@xstate/react'
import { AppContext } from 'context/AppContextProvider'

import BuscadorMachine from 'context/BuscadorMachine'
import NumberFormat from 'utils/NumberFormat'
import DateIntlFormat from 'utils/DateIntlFormat'

import { saveAs } from 'file-saver'
import { baseURL } from 'context/controllers'

import DetallePago from 'Models/DetallePago'

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

    const folioDate = new Date(data.mes)
    const dayFolio = folioDate.getDay()
    const mesFolio = folioDate.getMonth()
    const yearFolio = folioDate.getFullYear()

    fetch(`${baseURL}/pdf?folio=${data._id}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(data)
    }).then(res => {
      return res
        .arrayBuffer()
        .then(res => {
          const blob = new Blob([res], { type: 'applicacion/pdf' })
          saveAs(blob, `${data.dataClient[0].nombre}_${dayFolio}${mesFolio}${yearFolio}.pdf`)      
        })
        .catch(error => console.log(error))
    })
  }

  const { pago } = state.context

  return (
    state.matches('success') && pago
      .filter((pago) => pago.dataLote[0].lote === lote)
      .map((pago) => {

        let tipoPagoClass = 'tag__normal'
        switch (pago.tipoPago) {
          case 'extra':
            tipoPagoClass = 'tag__extra'
            break
          case 'acreditado':
            tipoPagoClass = 'tag__acreditado'    
            break
        }

        return (
          <>   
            <tr 
              key={pago._id} 
              id='row_info_pago'
              className='tabla__data'
              >
                <td><DateIntlFormat date={pago.mes} dateStyle='medium' /></td>
                <td
                  className={ pago.status ? 'tabla__data__pagado' : 'tabla__data__pendding' }
                >
                  { pago.status ? 'Pagado' : 'Pendiente' }
                </td>
                <td>{ pago.dataProject[0].title }</td>
                <td>{ pago.dataLote[0].lote }</td>
                <td>{ pago.refPago }</td>
                <td><span className={tipoPagoClass}>{ pago.tipoPago }</span></td>
                <td>{ <NumberFormat number={ pago.mensualidad } />}</td>                             
                <td className='estatus__menu'>
                    <button disabled={pago.status} onClick={() => handlePagador(pago._id)}>Pagar</button>
                    <button disabled={!pago.status} onClick={() => handledDetalle()}>Ver</button>
                    <button disabled={!pago.status} onClick={() => pdfCreator({ data: pago })}>Imprimir</button>
                  </td>
              </tr>
              <DetallePago 
                visible={openDetalle} 
                onCancel={handledDetalle} 
                info={pago} 
              />
          </>
        )
      })
  )
}

export default HookPagosTable
