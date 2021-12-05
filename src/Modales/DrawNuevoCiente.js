import { useEffect, useState } from 'react'
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton
} from '@chakra-ui/react'

import API from 'context/controllers'
import ClienteDataForm from 'views/ClienteDataForm'

const DrawNuevoCiente = ({ isOpen, setIsOpen }) => {

  const [getUsers, setGetUsers] = useState([])
  useEffect(() => {
    API.getAllClients()
      .then(res => {
        console.log(res)
        return setGetUsers(res)
      })
    
  }, [isOpen])

  console.log(getUsers)

  const onClose = () => setIsOpen(false)

  /**
   * Este comoponente sustituye el redireccionamiento
   * @constructor
   * @params { idProjecto }
   */

  return (
      <Drawer
        isOpen={isOpen}
        size={'xl'}
        placement='right'
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create your account</DrawerHeader>

          <DrawerBody>
            <ClienteDataForm />
          </DrawerBody>

          {/* <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='blue'>Save</Button>
          </DrawerFooter> */}
        </DrawerContent>
      </Drawer>
  )
}

export default DrawNuevoCiente
