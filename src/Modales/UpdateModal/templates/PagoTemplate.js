import { useForm } from 'react-hook-form'
import { useMachine } from '@xstate/react'
import UpdateMachine from '../UpdateMachine'
import DateIntlForma from 'utils/DateIntlFormat'
import './templates.scss'

const PagoTemplate = ({ data }) => {

  console.log({ data })

  const [current, send] = useMachine(UpdateMachine)

  const { register, handleSubmit } = useForm({
    defaultValues: {
      ...data
    }
  })

  const sendData = (payload) => {
    send('PATCH_DATA_PAGO', { payload })
  }

  return (    
      <div>
        <span>
            { current.matches('success') && 'Datos Guardados' }
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
                <p>Fecha de pago</p>
                <input
                  type="date"                  
                  name="fechaPago"
                  {...register('fechaPago')}
                >
                </input>
              </label>

          <div className="footer__template">
          <button type="submit">Modificar</button>    
          </div>                    
            </form>
          </section>
        </div>      
  )
}

export default PagoTemplate
