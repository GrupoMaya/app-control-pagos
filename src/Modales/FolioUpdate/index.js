import React, { useState } from 'react'
import { Modal } from 'antd'
import '../../Modales/UpdateModal/templates/templates.scss'
import MayaMachineAPI from 'context/controllers'
import { toast } from '@chakra-ui/react'
import { useMayaState } from 'context/MayaMachine'
const FolioUpdate = ({ mainModalHandled, document }) => {

  console.log(document)
  
  const [isModal, setIsModal] = useState(false)
  const [consecutivo, setConsecutivo] = useState(false)
  const [newFolio, setNewFolio] = useState(0)
  const { xstateQuery } = useMayaState()

  const handledModal = () => setIsModal(!isModal)
  
  const handleUpdate = async () => {
    console.log(newFolio)
    console.log(consecutivo)

    if (newFolio === '') return alert('El folio no puede estar vacio')

    await MayaMachineAPI
      .updateFolio({ folio: Number(newFolio), fixConsecutive: consecutivo, id: document._id })
      .then(res => {
        if (res.error) return alert('No se pudo actualizar el folio')
        xstateQuery.send('GET_PAGOS_BY_PROJECT', { query: xstateQuery.query })
        toast({
          title: 'Folio actualizado',
          description: 'El folio se ha actualizado correctamente',
          status: 'success',
          duration: 4000,
          isClosable: true
        })
      })
      .catch(err => console.log(err))
      .finally(() => {
        setIsModal(!isModal)
        mainModalHandled()
      })

  }
  
  return (
    <section>
      <div hidden={!isModal}>
          <Modal
            title={'Modificar Folio'}
            visible={isModal}
            onCancel={() => handledModal()}
            footer={null}
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <label style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <p style={{
                  fontSize: '1.5rem',
                  marginRight: '1rem'
                }}>Folio</p>
                <input
                  style={{
                    border: '1px solid #000',
                    borderRadius: '5px',
                    padding: '5px'
                  }}
                  type="text"
                  name="folio"
                  defaultValue={document.folio}
                  onChange={(e) => setNewFolio(e.target.value)}
                >
                </input>
              </label>

              <label style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '1rem'
              }}>
                  <p style={{
                    fontSize: '1rem',
                    marginRight: '1rem'
                  }}>
                    ¿El siguiente folio sera consecutivo?
                  </p>
                <input
                  onChange={() => setConsecutivo(!consecutivo)}
                  style={{
                    border: '1px solid #000',
                    padding: '5px'
                  }}
                  type="checkbox"
                  name="status"
                >
                </input>
              </label>
              <button
                style={{
                  backgroundColor: '#0C4C7D',
                  color: '#fff',
                  padding: '10px',
                  borderRadius: '5px',
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '1rem'
                }}
              onClick={() => handleUpdate()} >
                Modificar
              </button>
            </div>
          </Modal>
      </div>
      <button
      type='button'
      style={{
        backgroundColor: '#f44336',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        margin: '0 auto',
        border: 'none',
        cursor: 'pointer'
      }} onClick={() => handledModal()}
      >
        Modificar Folio
      </button>
    </section>
  )
}

export default FolioUpdate
