import { createMachine, assign } from 'xstate'
import { baseURL } from 'context/controllers'

const fetchBusqueda = async () => {

  const payload = await new Promise((resolve) => {
    resolve(
      fetch(`${baseURL}`)
    )
  })
    .then(res => res.json())
    .then(res => res)

  return payload
}

const fetchGetClientByID = async (ctx, event) => {
  
  const query = await fetch(`${baseURL}/cliente/${event.id}`)
    .then(res => res.json())
    .then(res => res.message)
    .catch(err => console.log(err))

  return query

}

const fetchGetLotesInfo = async ({ clientId }, event) => {
  
  const query = await fetch(`${baseURL}/lotes/cliente/${clientId}`)
    .then(res => res.json())
    .then(res => res.message)
    .catch(err => console.log(err))

  return query

}

const fetchGetPagosInfo = async (ctx, event) => {
  
  const query = await fetch(`${baseURL}/showinfoinvoice/${event.id}`)
    .then(res => res.json())
    .then(res => res.message)
    .catch(err => console.log(err))

  return query

}

const getPagosInfo = async (ctx, event) => {

  const { idProject, clientID } = event.query
    
  const query = await fetch(`${baseURL}/pagos/${idProject}?idcliente=${clientID}`)
    .then(res => res.json())
    .then(res => res.message)
    .catch(err => console.log(err))

  return query

}

const useSearch = async (ctx, { keyword }) => {
  
  const query = await fetch(`${baseURL}/search?user=${keyword}`)
    .then(res => res.json())
    .then(res => {
      if (Object.values(res.message).length === 0) throw new Error('No existen usarios con tus criterios de busqueda')
      return res.message
    })
    .catch(err => {
      throw new Error({ err })
    })

  return query

}

const BuscadorMachine = createMachine({
  id: 'buscador',
  initial: 'iddle',
  context: {
    busqueda: [],
    cliente: [],
    lotes: [],
    pagos: [],
    pago: [],
    clientId: undefined
  },
  states: {
    iddle: {},
    success: {},
    error: {},
    busqueda: {
      invoke: {
        src: fetchBusqueda,
        onDone: {
          target: 'success',
          actions: assign({
            busqueda: (ctx, event) => event.data
          })
        },
        onError: {
          target: 'error'
        }
      }
    },
    userSearch: {
      invoke: {
        src: useSearch,
        onDone: {
          target: 'success',
          actions: assign({
            busqueda: (ctx, evt) => evt.data 
          })
        },
        onError: {
          target: 'error'
        }
      }
    },
    getDataClientByID: {
      invoke: {
        src: fetchGetClientByID,
        onDone: {
          target: 'getLotesInfo',
          actions: assign({
            cliente: (ctx, evt) => evt.data 
          })
        },
        onError: {
          target: 'error'
        }
      }
    },
    getLotesInfo: {
      invoke: {
        src: fetchGetLotesInfo,
        onDone: {
          target: 'success',
          actions: assign({
            pagos: (ctx, evt) => evt.data 
          })
        },
        onError: {
          target: 'error'
        }
      }
    },
    getInfoPago: {
      invoke: {
        src: fetchGetPagosInfo,
        onDone: {
          target: 'success',
          actions: assign({
            pago: (ctx, evt) => evt.data 
          })
        },
        onError: {
          target: 'error'
        }
      }
    },
    getPagosInfo: {
      invoke: {
        src: getPagosInfo,
        onDone: {
          target: 'success',
          actions: assign({
            pagos: (ctx, evt) => evt.data 
          })
        },
        onError: {
          target: 'error'
        }
      }
    },
    removeUserLote: () => {
      
    }
  },
  on: {
    BUSCAR: 'busqueda',
    // traer en cascada 3 estados para obtener proyecto, pagos e informacion de los emplceados
    CLIENTE_DATA: {
      target: 'getDataClientByID',
      actions: (ctx, event) => {
        const id = ctx.clientId = event.id
        return id
      }
    },
    GET_LOTES: 'getLotesInfo',
    GET_PAGOS_INFO: 'getPagosInfo',
    USER_SEARCH: 'userSearch',
    GET_INFO_PAGO: 'getInfoPago',
    REMOVE_USER_LOTE: 'removeUserLote'
  }
  
})

export default BuscadorMachine

/*
  GET_INFO_PAGO: traer toda la informacion del pago
  GET_PAGOS_INFO: traer todos los pagos por proyecto
*/
