import { useState, useEffect } from 'react'
import { useMachine } from '@xstate/react'
import { Modal } from 'antd'
import UpdateMachine from './UpdateMachine'
import LoteTemplate from './templates/LoteTemplate'
import PagoTemplate from './templates/PagoTemplate'
import './updateStyles.scss'

const UpdateModal = ({ id, document }) => {

  console.log(id)

  /**
   * Tipos de documento
   * Lote
   * Pago
   * Cliente
   */

  const [current, send] = useMachine(UpdateMachine)
  
  const getDocumentType = () => {
    switch (document) {
      case 'Lote':
        return send('GET_LOTE_INFO', { id })
      case 'Pago':
        return send('GET_PAGO_INFO', { id })
      case 'Cliente':
        return 'Cliente'
      default:
        return 'Lote'
    }
  }

  const [isModal, setIsModal] = useState(false)
  const handledModal = () => setIsModal(!isModal)
    
  useEffect(() => {
    if (isModal) return getDocumentType()
  }, [isModal])

  const { lote, pago } = current.context

  return (
    <section>
      <header className="btn__danger">
        <button onClick={() => handledModal()}>Modificar</button>
      </header>
      <div hidden={!isModal}>
          <Modal
            title={`Editar los datos del ${document}`}
            visible={isModal}
            onOk={() => handledModal()}
            onCancel={() => handledModal()}
            footer={null}
                        
          >
            {
              document === 'Lote' && current.matches('success') && <LoteTemplate data={lote} />
            }
            {
              document === 'Pago' && current.matches('success') && <PagoTemplate data={pago} />
            }
            
          </Modal>
      </div>
    </section>
  )
}

export default UpdateModal
