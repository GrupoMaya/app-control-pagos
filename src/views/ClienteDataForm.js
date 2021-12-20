import { useState, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useMachine } from '@xstate/react'
import { ClienteMachine } from 'context/ClienteDataMachine'
import { useToast, Button } from '@chakra-ui/react'
import API from 'context/controllers'
import HookNameProjectById from 'hooks/HookNameProjectById'
import ModalUserSearch from 'Modales/ModalUserSearch'

const ClienteDataForm = ({ match, location }) => {

  const { idProyecto } = match.params
  const { proyecto, user } = location.state

  const defaultValues = () => {
    if (typeof user === 'undefined') {
      return {
        nombre: '',
        address: '',
        phone: '',
        email: ''
      }
    } else if (typeof user !== 'undefined') {
      return {
        nombre: user?.nombre,
        address: user?.address,
        phone: user?.phone,
        email: user?.email
      }
    }
  }
    
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: defaultValues()
  })
  
  const [getUsers, setGetUsers] = useState([])
  useEffect(() => {
    API.getAllClients()
      .then(res => {
        return setGetUsers(res)
      })
    
  }, [match])
    
  const [matchVisible, setMatchVisible] = useState(false)
  const onCloseMatch = () => setMatchVisible(!matchVisible)
  const userKeyword = watch('nombre')

  const isUserMatch = useMemo(() => {
    const regex = new RegExp(`${userKeyword}`, 'gi')
    const filter = getUsers.filter(({ nombre }) => {
      return nombre.match(regex)

    })
    return filter
  }, [userKeyword])
  
  const [showCliente, setShowCliente] = useState(false)
  const handleShowCliente = () => setShowCliente(!showCliente)

  const [showLote, setShowLote] = useState(false)
  const handleShowLote = () => setShowLote(!showLote)

  const [state, send] = useMachine(ClienteMachine)

  const onSubmit = (data) => {
    if (typeof user !== 'undefined') {
      send('ADD_LOTE_USER', { idProyecto, payload: { ...data, idUser: user._id } })
    } else if (typeof user === 'undefined') {
      
      send('ASSIGN_LOTE_TO_NEW_USER', { idProyecto, payload: data })
    }
  }

  useEffect(() => {
    if (state.matches('documentSave')) {
      return reset()
    }
  }, [state.value])
  
  const { loading, project } = HookNameProjectById({ id: proyecto })
 
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

    <div className="cliente__App__container">
      <div className="cliente__App__header">
        <h4>Añadir usuario <br/> proyecto: { loading && project?.title } </h4>
      </div>
      <div className="notification">
          {/* DOCUMENT SAVE ES EL ESTADO AL QUE PASA LA MAQUINA EN SUCCESS */}
          {/* { state.matches('documentSave') && handledSuccess() } */}
          { state.matches('error') && <span className="notification__error">El usuario ya existe</span> }
      </div>
      <section className="cliente__App_body">
      <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset>
                  <legend onClick={() => handleShowCliente() }>
                      Datos del Cliente
                      <button className="button__acordeon"></button>
                  </legend>

                <div>
                  <label htmlFor="nombre">
                    Nombre Completo
                    <input
                      type="text"
                      id="nombre"
                      aria-invalid={errors.title ? 'true' : 'false'}
                      { ...register('nombre', { required: true })}
                      />
                      {errors.nombre ? <p>Campo Obligatorio</p> : null }
                  </label>
                  {
                    isUserMatch.length > 0 &&
                    userKeyword.length >= 4 &&
                    <p
                      style={{ fontWeight: 900, marginBottom: '10px' }}
                      onClick={onCloseMatch}>{`Existen ${isUserMatch.length} con ese nombre, clic aqui para ver`}
                    </p>
                  }

                  <label htmlFor="address">
                    Dirección
                    <input
                      type="text"
                      id="text"
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
                    Email
                    <input
                      type="email"
                      id="email"
                      aria-invalid={errors.email ? 'true' : 'false'}
                      { ...register('email', { required: true })}
                    />
                      {errors.email ? <p>Campo Obligatorio</p> : null }
                  </label>
                  {/* TODO para adjuntar la foto */}
                  </div>
                    <div className="modal__footer">
                      <button className="btn red" onClick={() => history.back()}>
                        Regresar
                      </button>
                      <Button type="submit">Guardar</Button>
                      <Button type="reset" onClick={() => reset()}>Borrar Campos</Button>
                    </div>
                </fieldset>
                
                <fieldset>
                    <legend onClick={() => handleShowLote()}>
                        Asginación de Lote
                        <button className="button__acordeon"></button>
                    </legend>

                  <label htmlFor="inicioContrato">
                    Inicio de Contrato
                    <input
                      id="inicioContrato"
                      name='inicioContrato'
                      type="date"
                      { ...register('inicioContrato', { required: true })}
                      />
                  </label>

                  <div hidden={showLote}>
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

                  </div>
                </fieldset>
              </form>

      </section>
      <ModalUserSearch
        visible={matchVisible}
        dataResult={{ context: { busqueda: isUserMatch } }}
        onCancel={onCloseMatch}
      />
    </div>
  )
}

export default ClienteDataForm
