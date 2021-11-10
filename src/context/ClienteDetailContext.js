import { createMachine, assign } from 'xstate'
import { baseURL } from 'context/controllers'

const loadCliente = async (context, event) => {
  const data = await fetch(`${baseURL}/detail/client/${event.id}`)
  const cliente = await data.json()
  return cliente.message[0]  
}

const ClienteDetailContext = createMachine({
  id: 'ClienteDetailContext',
  initial: 'idle',
  context: {
    cliente: []
  },
  states: {
    idle: {},
    success: {},
    error: {},
    loadCliente: {
      invoke: {
        src: loadCliente,
        onDone: {
          target: 'success',
          actions: assign({
            cliente: (context, event) => event.data
          })
          
        }
      }
    }
  },
  on: {
    LOAD_CLIENTE: {
      target: 'loadCliente'
    }
  }
})

export default ClienteDetailContext
