import './sytles.scss'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMachine } from '@xstate/react'
import { ClienteMachine } from 'context/ClienteDataMachine'
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

export default function DrawerAddLote ({ isOpen, setIsOpen, dataClient }) {

  const [state, send] = useMachine(ClienteMachine)
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: {
      ...dataClient
    }
  })

  const loteSelected = watch('lote')
  const proyectoSelected = watch('idProyecto')
  const manzanaSelected = watch('manzana')
  
  const onSubmitData = (data) => {
    send('ADD_LOTE_USER', { idProyecto: data.idProyecto, payload: { ...data, idUser: dataClient._id } })
  }
  
  const [getUsers, setGetUsers] = useState([])
  useEffect(() => {
    API.getLotes({ _id: proyectoSelected || '000000000000000' })
      .then(res => {
        return setGetUsers(res)
      })
    
  }, [proyectoSelected])

  const isMatchLote = useMemo(() => {
    if (Array.isArray(getUsers)) {
      return getUsers.length > 0 &&
      Boolean(Object
        .values(getUsers)
        .find(({ lote, manzana }) => lote === loteSelected && manzana === manzanaSelected))
    }
  }, [loteSelected, manzanaSelected, getUsers])

  // para el selector
  const [projects, setProjects] = useState([])
  useEffect(() => {
    API.getAllProjetcs()
      .then(res => setProjects(res))
  }, [])
    
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
    }
  }, [state.value])

  return (
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={() => setIsOpen(false)}
        // finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Añadir nuevo lote</DrawerHeader>

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
              <label>
                Selecciona Proyecto
              </label>
              <select
                id='idProyecto'
                {...register('idProyecto')}
              >
                <option></option>
                {
                  projects && projects.map(project => {
                    return (
                      <option
                        key={project._id}
                        value={project._id}>{project.title.toUpperCase()}
                      </option>
                    )
                  })
                }
              </select>

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
