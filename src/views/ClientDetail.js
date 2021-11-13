import { useEffect } from 'react'
import { useMachine } from '@xstate/react'
import ClienteDetailContext from 'context/ClienteDetailContext'
import { useHistory } from 'react-router-dom'

const ClientDetail = (props) => {
  
  const [current, send] = useMachine(ClienteDetailContext)  
  useEffect(() => {
    send('LOAD_CLIENTE', { id: props.match.params.id })
  }, [props])
  
  const { cliente } = current.context

  const history = useHistory()
  const handledDetail = (e) => {        
    history.push(`/detalle/lote/${e._id}/cliente/${e.cliente[0]}/projecto/Perro`)
  }

  return (
    <div className='detalles__cliente'>
      <h1>Detalles del Cliente</h1>      
      { current.matches('success') && (
        <>
          <section>
            <h2>{cliente?.nombre}</h2>
          </section>
          <section>
            <h3>Lotes Activos</h3>
            {
              cliente?.Lotes.map(lote => {
                return (
                  <button onClick={() => handledDetail(lote)} className='button__lote' key={lote.id}>                    
                      <p>{lote.lote}</p>                    
                  </button>
                )
              })
            }
          </section>
        </>
      ) }
    </div>
  )
}

export default ClientDetail
