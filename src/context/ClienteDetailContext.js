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

const loadMorosos = async () => {
  const loadMorosos = await fetch(`${baseURL}/morosos`)
    .then(res => res.json())
    .then(res => {
      return res.message
    })
  return loadMorosos
}

const ClienteDetailContext = createMachine({
  id: 'ClienteDetailContext',
  initial: 'idle',
  context: {
    cliente: [],
    documentValues: [],
    morosos: []
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
    },
    loadMorosos: {
      invoke: {
        src: loadMorosos,
        onDone: {
          target: 'success',
          actions: assign({
            morosos: (ctx, event) => event.data
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
    },
    GET_MOROSOS: {
      target: 'loadMorosos'
    }
  }
})

export default ClienteDetailContext
