import { createMachine } from 'xstate'
import { baseURL } from 'context/controllers'

// assignLoteToNewUser
const assignLoteToNewUser = async (ctx, { idProyecto, payload }) => {

  const response = await fetch(`${baseURL}/assign/lote/user/${idProyecto}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(res => res)
    .catch(error => console.log(error))

  if (response.error) throw new Error('El usuario ya exite')
  return response
}

const addPagoToLote = async (ctx, event) => {
  
  const response = await fetch(`${baseURL}/lote/pago`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event.data)
  })
    .then(res => res.json())
    .then(res => res)
    .catch(error => console.log(error))

  if (response.error) throw new Error('Error al guardar el documento')
  return response
}

const postPago = async (ctx, { idPago, payload }) => {
  
  const response = await fetch(`${baseURL}/pagarnota/${idPago}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(res => res)
    .catch(error => console.log(error))

  if (response.error) throw new Error('Error al guardar el documento')
  return response
}

const addLoteToUser = async (ctx, { idProyecto, payload }) => {

  console.log({ idProyecto })
  
  const response = await fetch(`${baseURL}/add/lote/user/${idProyecto}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(res => res)
    .catch(error => console.log(error))

  if (response.error) throw new Error('Error al guardar el documento')
  return response
}

export const ClienteMachine = createMachine({
  id: 'clienteMachine',
  initial: 'iddle',
  context: {
    
  },
  states: {
    iddle: {},
    success: {},
    documentSave: {
      after: {
        3000: { target: 'iddle' }
      }
    },
    error: {},
    assignLoteToNewUser: {
      invoke: {
        src: assignLoteToNewUser,
        onDone: {
          target: 'documentSave'

        },
        onError: {
          target: 'error'
        }
      }
    },
    addPagoToLote: {
      invoke: {
        src: addPagoToLote,
        onDone: {
          target: 'success'
        },
        onError: {
          target: 'error'
        }
      }
    },
    postPago: {
      invoke: {
        src: postPago,
        onDone: {
          target: 'success'
        },
        onError: {
          target: 'error'
        }
      }
    },
    addLoteToUser: {
      invoke: {
        src: addLoteToUser,
        onDone: {
          target: 'documentSave'
        },
        onError: {
          target: 'error'
        }
      }
    }
  },
  
  on: {
    ASSIGN_LOTE_TO_NEW_USER: 'assignLoteToNewUser',
    ADD_PAGO_LOTE: 'addPagoToLote',
    POST__PAGAR: 'postPago',
    ADD_LOTE_USER: 'addLoteToUser'
  }
})
