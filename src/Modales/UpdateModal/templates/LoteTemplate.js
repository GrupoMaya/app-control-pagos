import { useForm } from 'react-hook-form'
import { useMachine } from '@xstate/react'
import UpdateMachine from '../UpdateMachine'
import DateIntlForma from 'utils/DateIntlFormat'
import './templates.scss'

const LoteTemplate = ({ data }) => {

  const [current, send] = useMachine(UpdateMachine)

  const { register, handleSubmit } = useForm({
    defaultValues: {
      ...data
    }
  })

  const sendData = (payload) => {
    send('PATCH_DATA_LOTE', { payload })
  }

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
                  name="precioTotal"
                  {...register('precioTotal')}
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

export default LoteTemplate
