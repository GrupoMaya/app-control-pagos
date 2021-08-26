import { Modal } from 'antd'
import HookPagosModalInvoce from 'hooks/HookPagosModalInvoce'

const ModalPagosClient = ({ openModalPago, handledOpen, lotes }) => {
  
  const closeModal = () => {
    handledOpen()
    location.reload()
  }

  return (
    <Modal
    visible={openModalPago}
    onCancel={closeModal}
    footer={null}    
    >
    <HookPagosModalInvoce lote={lotes[0]}/>
    </Modal>
  )
}

export default ModalPagosClient
