import { createMachine, assign } from 'xstate'
import { baseURL } from 'context/controllers'

const getLoteInfo = async (context, event) => {
  const loteResponse = await fetch(`${baseURL}/lote/${event.id}`)
    .then(res => res.json())
    .then(res => res.message)
  
  return loteResponse
}

const patchDataLote = async (context, { payload }) => {
  const lotePatchResponse = await fetch(`${baseURL}/update/lote/${payload._id}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'PATCH',
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(res => res.message)

  return lotePatchResponse
}

const getPagoInfo = async (context, event) => {
  const pagoResponse = await fetch(`${baseURL}/get/pago/${event.id}`)
    .then(res => res.json())
    .then(res => res.message)
  return pagoResponse
}

const patchDataPago = async (context, { payload }) => {
  const pagoPatchResponse = await fetch(`${baseURL}/update/pago/${payload._id}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'PATCH',
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(res => res.message)

  return pagoPatchResponse
}

export const UpdateMachine = createMachine({
  id: 'UpdateMachine',
  initial: 'idle',
  context: {
    lote: [],
    pago: [],
    error: null,
    currentProjectToReload: null
  },
  states: {
    idle: {},
    getLoteInfo: {
      invoke: {
        src: getLoteInfo,
        onDone: {
          target: 'success',
          actions: assign({
            lote: (context, event) => event.data
          }),
          onError: {
            target: 'error',
            actions: assign({
              error: (context, event) => event.data
            })
          }
        }
      }
    },
    patchDataLote: {
      invoke: {
        src: patchDataLote,
        onDone: {
          target: 'success',
          onError: {
            target: 'error'
          }
        }
      }
    },
    getPagoInfo: {
      invoke: {
        src: getPagoInfo,
        onDone: {
          target: 'success',
          actions: assign({
            pago: (context, event) => event.data
          }),
          onError: {
            target: 'error',
            actions: assign({
              error: (context, event) => event.data
            })
          }
        }
      }
    },
    patchDataPago: {
      invoke: {
        src: patchDataPago,
        onDone: {
          target: 'success',
          onError: {
            target: 'error'
          }
        }
      }
    },
    success: {},
    error: {}
  },
  on: {
    GET_LOTE_INFO: {
      target: 'getLoteInfo'
    },
    PATCH_DATA_LOTE: {
      target: 'patchDataLote'
    },
    GET_PAGO_INFO: {
      target: 'getPagoInfo'
    },
    PATCH_DATA_PAGO: {
      target: 'patchDataPago',
      actions: assign({
        currentProjectToReload: (ctx, event) => event.query
      })
    }
  }
})

export default UpdateMachine
