import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react'

function DetallePago ({ visible, onCancel, pdfURL }) {
  
  return (
    <>
      <Modal isOpen={visible} onClose={onCancel} size="50%" >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Vista Previa</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
              {/* iframe pdf blob url */}
            <iframe src={pdfURL} frameBorder="0" height="100%" width="100%" style={{ zoom: '5' }}>
            </iframe>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default DetallePago
