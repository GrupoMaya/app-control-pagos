import { useEffect } from 'react'
import { Modal } from 'antd'
import { useForm } from 'react-hook-form'
import { useMachine } from '@xstate/react'
import BuscadorMachine from 'context/BuscadorMachine'

import { useLocation, useHistory } from 'react-router-dom'

const ModalAddUserProject = ({ visible, onCancel }) => {

  const { register, handleSubmit, reset } = useForm()

  const [state, send] = useMachine(BuscadorMachine)
  const submitUser = (data) => {
    send('USER_SEARCH', { keyword: data.keyword })
  }

  const location = useLocation()
  const history = useHistory()

  const goToUser = (user) => {
    const idProject = location.pathname.split('/')[2]
    
    history.push({ 
      pathname: `/add/proyecto/${idProject}/cliente/${user._id}`,
      state: { proyecto: idProject, user }

    })
  }

  const setCancel = () => {
    onCancel(false)
    reset()
  }

  useEffect(() => {
    onCancel(false)
    reset()
  }, [location])

  const { busqueda } = state.context

  return (
    <Modal
      visible={visible}
      onCancel={setCancel}
      title="Añadir Usuario Existente"
      footer={null}
    >
    { state.matches('error') && <p className="error__message">No hay usuario que coincidan con tu búsqueda</p>}
    <form onSubmit={handleSubmit(submitUser)} className="modal__user__existente">
      
      <label>
        <input 
        placeHolder="Buscar nombre del cliente"
        type="search"
        name="keyword"
        { ...register('keyword')}
        />
        <button></button>
      </label>
    </form>

    {
      state.matches('success') && 
      <table className="modal__search__users">
      <thead>
        <th>Nombre Completo</th>
        <th>Acciones</th>
      </thead>  
      <tbody>
        {
          busqueda.map(user => {
            return (
            <tr key={user._id}>
              <td>
                { user.nombre }
              </td>
              <td>
                <button
                  onClick={() => goToUser(user)}>Agregar</button>
              </td>
            </tr>
            )
          })
        }
    </tbody>
    </table>
    }
    </Modal>
  )
}

export default ModalAddUserProject
