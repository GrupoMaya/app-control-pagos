import React, { useEffect, useState } from 'react'
import { Modal } from 'antd'
import { useToast } from '@chakra-ui/react'
const API = process.env.REACT_APP_URL

const ModalProyectName = ({ open, handleCloseModal, proyectName, id }) => {

  const toast = useToast()
  const [currentName, setCurrentName] = useState(proyectName)
  const [loading, setLoading] = useState(false)

  let timer = null

  const handledFormEdit = async (e) => {
    e.preventDefault()
    
    if (currentName === proyectName) {
      toast({
        title: 'No hay cambios',
        description: 'No se ha detectado ningún cambio',
        status: 'info',
        duration: 9000
      })

      timer = setTimeout(() => {
        setLoading(false)
      }, [1000 * 3])

      return
    }

    setLoading(true)
    const response = await fetch(`${API}/update/proyecto/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: currentName })
    })
      .then(res => res.json())

    if (response.message.isActive === true) {
      window.location.reload()
    }
  }

  useEffect(() => {
    return () => {
      setLoading(false)
      clearTimeout(timer)
    }
  }, [])

  return (
    <Modal
      centered
      visible={open}
      onCancel={handleCloseModal}
      footer={null}
      width={'fit-content'}
    >
    <form onSubmit={handledFormEdit} className="form__types">
      <p>Editar Nombre del proyecto</p>
      <input
        id="proyectName"
        placeholder="Nombre del proyecto"
        type="text"
        defaultValue={currentName}
        onChange={(e) => setCurrentName(e.target.value)}
      />
      <button disabled={!!loading}>
        Guardar
      </button>
    </form>

    </Modal>
  )
}

export default ModalProyectName
