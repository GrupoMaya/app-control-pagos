import './sytles.scss'
import { useContext, useEffect, useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation } from 'react-router-dom'
import { useMachine } from '@xstate/react'
import { ClienteMachine } from 'context/ClienteDataMachine'
import { v4 as uuidv4 } from 'uuid'
import API from 'context/controllers'

import {
  Drawer,
  DrawerBody,
  Box,
  Stack,
  Divider,
  DrawerFooter,
  Button,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useToast
} from '@chakra-ui/react'
import { AppContext } from 'context/AppContextProvider'
import { useMayaState } from 'context/MayaMachine'

export default function DrawerAddUser () {

  const location = useLocation()
  const idProyecto = location.pathname.split('/')[2]
  const uuid = uuidv4()

  const [state, send] = useMachine(ClienteMachine)

  const { openDrawerNewUser, toggleDrawerNewUser } = useContext(AppContext)
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: {
      email: uuid
    }
  })

  const { xstateMutate, xstateQuery } = useMayaState()
  const onSubmitData = (data) => {
    send('ASSIGN_LOTE_TO_NEW_USER', { idProyecto, payload: data })
  }

  const loteSelected = watch('lote')
  const manzanaSelected = watch('manzana')
  const [getUsers, setGetUsers] = useState([])
  useEffect(() => {
    API.getLotes({ _id: idProyecto })
      .then(res => {
        return setGetUsers(res)
      })
    
  }, [loteSelected])

  const isMatchLote = useMemo(() => {
    if (Array.isArray(getUsers)) {
      return getUsers.length > 0 &&
      Boolean(Object
        .values(getUsers)
        .find(({ lote, manzana }) => lote === loteSelected && manzana === manzanaSelected))
    }
  }, [loteSelected, manzanaSelected, getUsers])

  const toast = useToast()
  useEffect(() => {
    if (state.matches('documentSave')) {
      reset()
      toast({
        title: 'Cliente guardado',
        description: 'El cliente ha sido guardado correctamente',
        status: 'success',
        duration: 9000,
        isClosable: true
      })
      toggleDrawerNewUser()
      xstateMutate('GET_DATA', { payload: xstateQuery.payload })
    }
  }, [state.value])

  useEffect(() => {
    return () => reset()
  }, [])

  return (
      <Drawer
        isOpen={openDrawerNewUser}
        placement='right'
        onClose={toggleDrawerNewUser}
        // finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Crear nuevo cliente</DrawerHeader>

          <DrawerBody className='form_box'>
            {
              isMatchLote ? <span className='alert__lote'>{`Ya existe el lote: ${loteSelected} `}</span> : null
            }
            <form onSubmit={handleSubmit(onSubmitData)}>
              <Box>
              <label htmlFor="nombre">
                Nombre Completo
                <input
                  type="text"
                  id="nombre"
                  placeholder='Ingrese el nombre completo'
                  aria-invalid={errors.title ? 'true' : 'false'}
                  { ...register('nombre', { required: true })}
                  />
                  {errors.nombre ? <p>Campo Obligatorio</p> : null }
              </label>
              <label htmlFor="address">
                Dirección
                <input
                  type="text"
                  id="text"
                  placeholder='Dirección del cliente'
                  aria-invalid={errors.address ? 'true' : 'false'}
                  { ...register('address', { required: true })}
                />
                  {errors.address ? <p>Campo Obligatorio</p> : null }
              </label>
              <label htmlFor="phone">
                Teléfono
                <input
                  type="text"
                  id="phone"
                  aria-invalid={errors.address ? 'true' : 'false'}
                  { ...register('phone', { required: true })}
                />
                  {errors.phone ? <p>Campo Obligatorio</p> : null }
              </label>
              <label htmlFor="email">
                ID Cliente
                <input
                  disabled
                  type="text"
                  id="email"
                  placeholder='Ingrese el email'
                  aria-invalid={errors.email ? 'true' : 'false'}
                  { ...register('email', { required: true })}
                />
                  {errors.email ? <p>Campo Obligatorio</p> : null }
              </label>
              </Box>
                <Stack direction="row" h="50px" p={4}>
                  <Divider orientation="vertical" />
                  <h6>Datos del lote del cliente</h6>
                </Stack>

              <Box>
              <label htmlFor="inicioContrato">
                Inicio de Contrato
                <input
                  id="inicioContrato"
                  name='inicioContrato'
                  type="date"
                  { ...register('inicioContrato', { required: true })}
                  />
                </label>
                
                <label htmlFor="lote">
                  Número de Lote
                  <input
                    id="lote"
                    type="number"
                    min={0}
                    aria-invalid={errors.lote ? 'true' : 'false' }
                    { ...register('lote', { required: true, min: 1 })}
                    />
                    {errors.lote ? <p>Ingrese un número valido</p> : null }
                </label>

                <label htmlFor="manzana">
                  Número de Manzana
                  <input
                    id="manzana"
                    type="text"
                    min={0}
                    aria-invalid={errors.manzana ? 'true' : 'false' }
                    { ...register('manzana')}
                    />
                    {errors.manzana ? <p>Ingrese un número valido</p> : null }
                </label>

                <label htmlFor="precioTotal">
                  Precio Total
                  <input
                    id="precioTotal"
                    type="number"
                    min={0}
                    aria-invalid={errors.precioTotal ? 'true' : 'false' }
                    { ...register('precioTotal', { required: true })}
                    />
                    {errors.precioTotal ? <p>Campo Obligatorio</p> : null }
                </label>

                <label htmlFor="enganche">
                  Enganche
                  <input
                    id="enganche"
                    type="number"
                    min={0}
                    aria-invalid={errors.enganche ? 'true' : 'false' }
                    { ...register('enganche', { required: true })}
                    />
                    {errors.enganche ? <p>Campo Obligatorio</p> : null }
                </label>

                <label htmlFor="financiamiento">
                  Monto financiamiento
                  <input
                    id="financiamiento"
                    type="number"
                    min={0}
                    aria-invalid={errors.financiamiento ? 'true' : 'false' }
                    { ...register('financiamiento', { required: true })}
                    />
                    {errors.financiamiento ? <p>Campo Obligatorio</p> : null }
                </label>

                <label htmlFor="plazo">
                  Plazo  &#40; Total de Meses &#41;
                  <input
                    id="plazo"
                    type="number"
                    min={0}
                    aria-invalid={errors.plazo ? 'true' : 'false' }
                    { ...register('plazo', { required: true, min: 1 })}
                    />
                    {errors.plazo ? <p>Ingrese un numero valido</p> : null }
                </label>

                <label htmlFor="mensualidad">
                  Mensualidad
                  <input
                    id="mensualidad"
                    type="number"
                    min={0}
                    aria-invalid={errors.mensualidad ? 'true' : 'false' }
                    { ...register('mensualidad', { required: true })}
                    />
                    {errors.mensualidad ? <p>Campo Obligatorio</p> : null }
                </label>
              </Box>

          <DrawerFooter sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              onClick={toggleDrawerNewUser}
              type="button"
              colorScheme='teal'
              sx={{ width: '100%', marginRight: '10px' }}
            >
              Cancelar
            </Button>
            <Button
              colorScheme='teal'
              sx={{ width: '100%' }}
              variant="outline"
              type="submit"
              disabled={!!isMatchLote}
              isLoading={state.matches('assignLoteToNewUser')}
            >
              Guardar
            </Button>
          </DrawerFooter>

            </form>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
  )
}
