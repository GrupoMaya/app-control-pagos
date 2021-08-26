import { useEffect } from 'react'
import { useMachine } from '@xstate/react'
import BuscadorMachine from 'context/BuscadorMachine'

import TablaClienteInfo from 'Components/TablaClienteInfo'

const Cliente = ({ match }) => {

  const [state, send] = useMachine(BuscadorMachine)

  useEffect(() => {
    send('CLIENTE_DATA', { id: match.params?.slug })
  }, [])

  const { cliente, lotes, pagos } = state.context
  
  return (
        <div className="cliente__App__container">
            {
                state.matches('success') && 
                    <TablaClienteInfo 
                        cliente={cliente} 
                        lotes={lotes}
                        pagos={pagos}
                    />
            }
        </div>
  )
}

export default Cliente
