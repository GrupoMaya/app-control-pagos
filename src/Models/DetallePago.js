import { Modal } from 'antd'

const DetallePago = ({ visible, onCancel, info }) => {

  const onSubmit = (date) => {
    date.preventDeafault()
  }

  return (
    <Modal
      title="Detalles de Pago"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <div>
        {
        <form onSubmit={onSubmit} className="form__detalle__pago">
          <label>
            Referencia de Pago
            <input
              disabled={true}
              type="tex"
              defaultValue={info.refPago}
            >
            </input>

          </label>
          <label>
            Referencia Bancaria
            <input
              disabled={true}
              type="tex"
              defaultValue={info.refBanco}
            >
            </input>

          </label>
          <label>
            Cuenta Bancaria
            <input
              disabled={true}
              type="tex"
              defaultValue={info.ctaBancaria}
            >
            </input>

          </label>
          <label>
            Banco
            <input
              disabled={true}
              type="tex"
              defaultValue={info.banco}
            >
            </input>
          </label>
        </form>
        }
      </div>
    </Modal>
  )

}

export default DetallePago
