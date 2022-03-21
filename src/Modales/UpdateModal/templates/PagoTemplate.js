import React, { useEffect } from 'react'
import { useToast } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useMachine } from '@xstate/react'
import UpdateMachine from '../UpdateMachine'
import DateIntlForma from 'utils/DateIntlFormat'
import { UserState } from 'context/userContext'
import { useMayaState } from 'context/MayaMachine'
import './templates.scss'

const PagoTemplate = ({ data }) => {

  const [current, send] = useMachine(UpdateMachine)

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      ...data,
      mes: data?.mes?.split('T')[0],
      fechaPago: data?.fechaPago?.split('T')[0]
    }
  })

  const { xstateMutate } = useMayaState()
  const sendData = (payload) => {
    send('PATCH_DATA_PAGO', { payload })
  }

  const toast = useToast()
  useEffect(() => {
    if (current.matches('success')) {
      toast({
        title: 'Pago actualizado',
        description: 'El pago se ha actualizado correctamente',
        status: 'success',
        duration: 4000,
        isClosable: true
      })

      xstateMutate('GET_PAGOS_BY_PROJECT')
      setTimeout(() => {
        reset()
      }, 10000)
    }
  }, [current.value])

  const { state } = UserState()
  const { user: userState } = state.context

  return (
      <div>
        <span>
        </span>
          <section className="form__template">
            <form onSubmit={handleSubmit(sendData)}>

              <label>
                <p>Banco</p>
                <input
                  type="text"
                  name="banco"
                  {...register('banco')}
                />
              </label>

            <label>
                <p>Cuenta Bancaria</p>
                <input
                  type="text"
                  name="ctaBancaria"
                  {...register('ctaBancaria')}
                >
                </input>
              </label>
             
              <label>
                <p>Total pago</p>
                <input
                  type="text"
                  name="mensualidad"
                  {...register('mensualidad')}
                >
                </input>
              </label>

              <label>
                <p>Referencia de pago</p>
                <input
                  type="text"
                  name="refPago"
                  {...register('refPago')}
                >
                </input>
              </label>

              <label>
                <p>Referencia Bancaria</p>
                <input
                  type="text"
                  name="refBanco"
                  {...register('refBanco')}
                >
                </input>
              </label>

              { data.extraSlug &&
                <label>
                  <p>Referencia de documento Extra</p>
                  <input
                    type="text"
                    name="extraSlug"
                    {...register('extraSlug')}
                  >
                  </input>
                </label>
              }
              
            <small>
                <p>Fecha Guardada </p>
                { data.fechaPago && <DateIntlForma date={data.fechaPago} /> }
            </small>
              <label>
                <p>Fecha de Deposito</p>
                <input
                  type="date"
                  name="fechaPago"
                  {...register('fechaPago')}
                >
                </input>
              </label>

            <small>
                <p>Fecha actual</p>
                { data.mes && <DateIntlForma date={data.mes} /> }
            </small>
              <label>
                <p>Fecha de Documento</p>
                <input
                  type="date"
                  name="mes"
                  {...register('mes')}
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

export default PagoTemplate
