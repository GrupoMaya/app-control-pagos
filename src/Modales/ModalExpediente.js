import { Modal } from 'antd'

const ModalExpediente = ({ visible, onCancel, cliente }) => {
  return (
    <Modal
          title="Expediente del Cliente"
          visible={visible}
          onCancel={onCancel}
          footer={null}
        >
          {
            Object.values(cliente)
              .map(({ clienteData }) => {
                return clienteData.map(cliente => {
                  return (
                    <div key={cliente._id} className="expediente__data">
                    <section>
                        <p>Nombre:</p>
                        {cliente.nombre}
                    </section>
                    <section>
                        <p>DIRRECCIÓN</p>
                        {cliente.address}
                    </section>
                    <section>
                        <p>Teléfono</p>
                        {cliente.phone}
                    </section>
                    <section>
                        <p>Email</p>
                        {cliente.email}
                    </section>
                    </div>
                  )
                })
              })
          }
        </Modal>
  )
}

export default ModalExpediente
