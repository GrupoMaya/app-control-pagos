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

const DrawUpdateCiente = ({ isOpen, setIsOpen, data }) => {

  const onClose = () => setIsOpen(false)
  const { handleSubmit, control, watch } = useForm({
    defaultValues: {
      nombre: data.nombre
    }
  })

  const nombreWatch = watch('nombre')

  const hanldedPatch = () => {
    setIsloading(false)
    onClose()
    window.location.reload()
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
