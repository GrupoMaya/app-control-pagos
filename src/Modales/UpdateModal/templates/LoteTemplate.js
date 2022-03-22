import React, { useEffect } from 'react'
import { useToast } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useMachine } from '@xstate/react'
import UpdateMachine from '../UpdateMachine'
import DateIntlForma from 'utils/DateIntlFormat'
import { UserState } from 'context/userContext'
import { useParams } from 'react-router-dom'
import './templates.scss'

/**
 * Para poder cambiar datos del lote en la vista de proyectos / lotes
 * @param {Function} allLotesParent - xstate function de la vista de proyectos/id/slug
 * @param {Object} data - payload con la informacion del lote
 * @returns Solo cambia los datos del lote no retorna nada
 */

const LoteTemplate = ({ data, dispatch: allLotesParent }) => {

  const [current, send] = useMachine(UpdateMachine)

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      ...data
    }
  })

  const sendData = (payload) => {
    send('PATCH_DATA_LOTE', { payload })
  }

  const match = useParams()
  const toast = useToast()
  useEffect(() => {
    if (current.matches('success')) {
      toast({
        title: 'Pago actualizado',
        description: 'El pago se ha actualizado correctamente',
        status: 'success',
        duration: 9000,
        isClosable: true
      })
      
      setTimeout(() => {
        reset()
        allLotesParent('GET_DATA', { id: match.slug })
      }, 2000)
    }
  }, [current.value])

  const { state } = UserState()
  const { user: userState } = state.context

  return (
      <div>
        <span>
            { current.matches('success') && 'Datos Guardados' }
        </span>
          <section className="form__template">
            <form onSubmit={handleSubmit(sendData)}>

              <label>
                <p>Lote</p>
                <input
                  type="text"
                  name="lote"
                  {...register('lote')}
                />
              </label>
            
            <small>
              <p>Fecha Almacenada </p>
              { data.inicioContrato && <DateIntlForma date={data.inicioContrato} /> }
            </small>
            <label>
                <p>Inicio Contrato</p>
                <input
                  type="date"
                  name="inicioContrato"
                  {...register('inicioContrato')}
                >
                </input>
              </label>
             
              <label>
                <p>Mensualidad</p>
                <input
                  type="text"
                  name="mensualidad"
                  {...register('mensualidad')}
                >
                </input>
              </label>

              <label>
                <p>Plazo</p>
                <input
                  type="text"
                  name="plazo"
                  {...register('plazo')}
                >
                </input>
              </label>

              <label>
                <p>Precio Total</p>
                <input
                  type="text"
                  name="precioTotal"
                  {...register('precioTotal')}
                >
                </input>
              </label>
          <div className="footer__template">
          { userState?.role === 'admin' && <button type="submit">Modificar</button> }
          </div>
            </form>
          </section>
        </div>
  )
}

export default LoteTemplate
