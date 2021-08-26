import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMachine } from '@xstate/react'
import { ClienteMachine } from 'context/ClienteDataMachine'

import HookNameProjectById from 'hooks/HookNameProjectById'

const ClienteDataForm = ({ match, location }) => {

  const [showCliente, setShowCliente] = useState(false)
  const handleShowCliente = () => setShowCliente(!showCliente)

  const [showLote, setShowLote] = useState(false)
  const handleShowLote = () => setShowLote(!showLote)
  
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
    
  const [state, send] = useMachine(ClienteMachine)

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: defaultValues()
  })
  
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

  return (

    <div className="cliente__App__container">
      <div className="cliente__App__header">
        <h4>Añadir usuario <br/> proyecto: { loading && project?.title } </h4>
      </div>
      <div className="notification">
          <button className="btn" onClick={() => history.back()}>
            Regresar
          </button>
          { state.matches('documentSave') && <span className="notification__success">¡Exito al guardar el Cliente!</span>}
          { state.matches('error') && <span className="notification__error">El usuario ya existe</span> }
      </div>
      <section className="cliente__App_body">      
      <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset>
                  <legend onClick={() => handleShowCliente() }>
                      Datos del Cliente
                      <button className="button__acordeon"></button>
                  </legend>

                  <div hidden={showCliente}>
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
                      <button type="submit">Guardar</button>
                      <button tyepe="reset" onClick={() => reset()}>Borrar Campos</button>
                    </div>
                </fieldset>
                
                <fieldset>
                    <legend onClick={() => handleShowLote()}>
                        Asginación de Lote
                        <button className="button__acordeon"></button>
                    </legend>

                  <label htmlFor="inicioControl">
                    Inicio de Contrato
                    <input 
                      id="inicioControl"
                      type="date"
                      min={0}
                      aria-invalid={errors.inicioControl ? 'true' : 'false' }
                      { ...register('inicioControl', { required: true })}          
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
                        type="number"
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
      <div className="cliente_App_footer">
      </div>

    </div>
  )
}

export default ClienteDataForm
