import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'

// context
import { useMayaDispatch, useMayaState } from 'context/MayaMachine'

const ModalClienteInfo = () => {

  const [show, setShow] = useState(true)
  const handleShow = () => setShow(!show)
  
  const blackdropRef = useRef()
  useEffect(() => {
    blackdropRef.current?.addEventListener('click', function () {
      setShow(true)
    })
  }, [])

  const dispatch = useMayaDispatch()
  const state = useMayaState()

  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const onSubmit = (data) => {
    dispatch('POST_CLIENTES', { payload: data })
  }

  useEffect(() => {
    return function cleanUp () {
      reset()
    }
  }, [show])

  useEffect(() => {
    if (state.matches('success')) {
      return reset()
    }
  }, [state])

  return (
    <div className="modal">
      <section className="modal__container" hidden={show}>

        <section ref={blackdropRef} className="modal__black__drop"/>
        <section className="modal__card">
            <div className="modal__header">
            { state.matches('error') && <span>El Proyecto ya está Activo</span> }
            { state.matches('documentSave') && <div className="spinner" />}
            </div>
            <div className="modal__body"> 

              <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset>
                  <legend>Datos del Cliente</legend>
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
                </fieldset>
                <div className="modal__footer">
                  <button type="submit">Guardar</button>
                  <button tyepe="reset" onClick={() => setShow(true)}>Cerrar</button>
                </div>
              </form>

            </div>
        </section>

      </section>
      <span onClick={() => handleShow()} type="button" className="ico__add__user"></span>
    </div>
  )
}

export default ModalClienteInfo
