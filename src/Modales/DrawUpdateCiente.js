import { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  Button
} from '@chakra-ui/react'
import { useForm, Controller } from 'react-hook-form'
import API from 'context/controllers'
import { useParams } from 'react-router-dom'

const DrawUpdateCiente = ({ isOpen, setIsOpen, data, send }) => {

  const onClose = () => setIsOpen(false)
  const { handleSubmit, control, watch } = useForm({
    defaultValues: {
      nombre: data.nombre
    }
  })

  const nombreWatch = watch('nombre')

  const match = useParams()
  const hanldedPatch = () => {
    setIsloading(false)
    onClose()
    send('LOAD_CLIENTE', { id: match.id })
  }

  const [isLoading, setIsloading] = useState(false)
  const onSubmit = (body) => {
    setIsloading(true)
    API.patchCliente({ id: data._id, body })
      .finally(() => hanldedPatch())

  }
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Cambiar nombre</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
        <form onSubmit={handleSubmit(onSubmit)} className='d-flex'>
            <Controller
              control={control}
              name='nombre'
              render={({ field }) => {
                return <Input {...field}></Input>
              }}
            />
            <Button
              type='submit'
              disabled={Boolean(data.nombre === nombreWatch)}
              isLoading={isLoading}
              marginLeft={2}
              colorScheme='teal'
              variant='solid'
            >
            Guardar
          </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default DrawUpdateCiente
