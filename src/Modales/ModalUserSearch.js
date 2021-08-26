import { Modal } from 'antd'
import { useHistory } from 'react-router-dom'

const ModalUserSearch = ({ visible, onCancel, dataResult }) => {

  const { busqueda } = dataResult?.context  
  const history = useHistory()
  const goToUser = (_id) => {
    history.push(`/cliente/${_id}`)
    onCancel()
  }

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      title="Resultados de la busqueda"
      footer={null}
    >
      
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
                    onClick={() => goToUser(user._id)}>Ir</button>
                </td>
              </tr>
              )
            })
          }
      </tbody>
      </table>
    </Modal>
  )
}

export default ModalUserSearch
