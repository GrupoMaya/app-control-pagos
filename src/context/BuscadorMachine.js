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

const getPagosByProject = async ({ currentPayloadGetDataInfo }, event) => {

  const { idProject, clientID } = currentPayloadGetDataInfo
  console.log(idProject, clientID, 'para ser benditos')
    
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

const getSettingsApp = async () => {

  const query = await fetch(`${baseURL}/settingsapp/get`)
    .then(res => res.json())
    .then(res => res.message[0])

  return query
}

const patchSettingsData = async (ctx, { data }) => {

  const query = await fetch(`${baseURL}/settingsapp/dataInfo`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(res => res)

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
    appData: [],
    clientId: undefined,
    currentPayloadGetDataInfo: null
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
    getPagosByProject: {
      invoke: {
        src: getPagosByProject,
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
    getSettingsApp: {
      invoke: {
        src: getSettingsApp,
        onDone: {
          target: 'success',
          actions: assign({
            appData: (ctx, evt) => evt.data
          })
        },
        onError: {
          target: 'error'
        }
      }
    },
    patchSettingsData: {
      invoke: {
        src: patchSettingsData,
        onDone: {
          target: 'getSettingsApp'
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
    GET_PAGOS_BY_PROJECT: {
      target: 'getPagosByProject',
      actions: (ctx, event) => {
        const payload = ctx.currentPayloadGetDataInfo = event.query
        console.log(payload, 'payload')
        return payload
      }
    },
    USER_SEARCH: 'userSearch',
    GET_INFO_PAGO: 'getInfoPago',
    REMOVE_USER_LOTE: 'removeUserLote',
    GET_SETTINGS_APP: 'getSettingsApp',
    PATCH_SETTINGS_DATA: 'patchSettingsData'
  }
  
})

export default BuscadorMachine

/*
  GET_INFO_PAGO: traer toda la informacion del pago
  GET_PAGOS_INFO: traer todos los pagos por proyecto
*/
