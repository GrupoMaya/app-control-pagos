import { createContext, useContext, useState } from 'react'
import { useMachine } from '@xstate/react'
import { assign, createMachine } from 'xstate'

import MayaMachineAPI from './controllers'

export const MayaStateContext = createContext()
export const MayaDispatchContext = createContext()

export const MayaMachine = createMachine({
  id: 'maya',
  initial: 'iddle',
  context: {
    proyectos: [],
    proyecto: [],
    lotes: [],
    currentProjectId: null
  },
  states: {
    iddle: {},
    success: {},
    error: {
      after: {
        3000: { target: 'getProyectos' }
      }
    },
    documentSave: {
      after: {
        3000: { target: 'getProyectos' }
      }

    },
    createProyectos: {
      invoke: {
        src: MayaMachineAPI.createProyectos,
        onDone: {
          target: 'documentSave'
        },
        onError: {
          target: 'error',
          actions: (ctx, error) => console.log(error)
        }
      }
    },
    getProyectos: {
      invoke: {
        src: MayaMachineAPI.getProyectos,
        onDone: {
          target: 'success',
          actions: assign({
            proyectos: (ctx, event) => event.data
          })
        },
        onError: {
          target: 'error',
          actions: (ctx, error) => console.log(error)
        }
      }
    },
    createCLient: {
      invoke: {
        src: MayaMachineAPI.createCLient,
        onDone: {
          target: 'documentSave'
        },
        onError: {
          target: 'error',
          actions: (ctx, error) => console.log(error)
        }
      }
    },
    getProyectoByID: {
      invoke: {
        src: MayaMachineAPI.getProyectoByID,
        onDone: {
          target: 'getAllLotesByProjectID',
          actions: assign({
            proyecto: (ctx, event) => event.data
          })
        },
        onError: {
          actions: (ctx, error) => console.log(error)
        }
      }
    },
    getAllLotesByProjectID: {
      invoke: {
        src: MayaMachineAPI.getAllLotesByProjectID,
        onDone: {
          target: 'success',
          actions: assign({
            lotes: (ctx, event) => event.data
          })
        },
        onError: {
          target: 'error',
          actions: (ctx, error) => console.log(error)
        }
      }
    }

  },
  on: {
    POST_PROYECTOS: 'createProyectos',
    POST_CLIENTES: 'createCLient',
    GET_PROYECTOS: 'getProyectos',

    // primera carga de estados del componente de proyectos
    GET_PROYECTOS_BY_ID: 'getProyectoByID',
    GET_ALL_LOTES_BY_POJECT_ID: 'getAllLotesByProjectID',
    // combinacion de los dos de arriba
    GET_DATA: {
      target: 'getProyectoByID',
      actions: (ctx, event) => {
        ctx.currentProjectId = event.payload || event.id
      }
    }
  }
  
})

export const MayaAppMachineProvider = ({ children }) => {
  const [state, dispatch] = useMachine(MayaMachine)
  const [xstateQuery, setXstateQuery] = useState({
    send: null,
    query: null
  })

  const xstateMutate = (event, query) => {
    const payload = query || xstateQuery.query
    xstateQuery.send(event, { ...payload })
  }

  return (
    <MayaStateContext.Provider value={{ state, xstateQuery, xstateMutate }}>
      <MayaDispatchContext.Provider
      value={{
        dispatch,
        setXstateQuery
      }}
      >
        { children }
      </MayaDispatchContext.Provider>
    </MayaStateContext.Provider>
  )
}

export const useMayaState = () => useContext(MayaStateContext)
export const useMayaDispatch = () => useContext(MayaDispatchContext)
