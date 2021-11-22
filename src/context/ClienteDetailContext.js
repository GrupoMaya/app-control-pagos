import { createMachine, assign } from 'xstate'
import { baseURL } from 'context/controllers'

const loadCliente = async (context, event) => {
  const data = await fetch(`${baseURL}/detail/client/${event.id}`)
  const cliente = await data.json()
  return cliente.message
}

const loadDocumentValues = async (context, { id, documentType }) => {
  const data = await fetch(`${baseURL}/getnames/${documentType}/${id}`)
    .then(res => res.json())
    .then(res => res.message[0])
    .catch(err => console.log(err))

  return data
}

const ClienteDetailContext = createMachine({
  id: 'ClienteDetailContext',
  initial: 'idle',
  context: {
    cliente: [],
    documentValues: []
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
    },
    loadDocumentValues: {
      invoke: {
        src: loadDocumentValues,
        onDone: {
          target: 'success',
          actions: assign({
            documentValues: (context, event) => event.data
          })
        }
      }
    }
  },
  on: {
    LOAD_CLIENTE: {
      target: 'loadCliente'
    },
    GET_DOCUMENT_VALUES: {
      target: 'loadDocumentValues'
    }
  }
})

export default ClienteDetailContext
