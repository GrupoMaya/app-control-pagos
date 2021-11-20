import React, { useEffect } from 'react'
import { Modal } from 'antd'

const DetallePago = ({ visible, onCancel, pdfURL }) => {
 
  useEffect(() => {
    // const pdf = window.atob(pdfURL)
    // console.log(pdf)
  }, [pdfURL])

  return (
    <Modal
      title="Detalles de Pago"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      {/* iframe pdf blob url */}      
      <iframe src={pdfURL} frameBorder="0" height="100%" width="100%">
      </iframe>          
    </Modal>
  )

}

export default DetallePago
