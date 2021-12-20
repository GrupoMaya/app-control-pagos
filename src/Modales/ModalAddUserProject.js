import { useEffect, useContext } from 'react'
import { AppContext } from 'context/AppContextProvider'
import { Modal } from 'antd'
import { useForm } from 'react-hook-form'
import { useMachine } from '@xstate/react'
import BuscadorMachine from 'context/BuscadorMachine'

import { useLocation, useHistory } from 'react-router-dom'
import { Button } from '@chakra-ui/react'

const ModalAddUserProject = ({ visible, onCancel }) => {

  const { toggleDrawerNewUser } = useContext(AppContext)

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
      pathname: `/detalle/cliente/${user._id}`,
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
    <div className='d-flex center'>
      {
        state.matches('error') &&
        <Button
          variant="solid"
          sx={{ width: '120px' }}
          colorScheme='teal'
          onClick={() => toggleDrawerNewUser()}>
            Añadir Nuevo
        </Button>
      }
    </div>
  </Modal>
  )
}

export default ModalAddUserProject
