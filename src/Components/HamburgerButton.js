import { useState, useContext } from 'react'
import { useLocation, useHistory } from 'react-router-dom'

import NuevoPoject from 'Modales/NuevoProject'
import Buscador from './Buscador'

// contexto
import { AppContext } from 'context/AppContextProvider'
import ModalAddUserProject from 'Modales/ModalAddUserProject'

import ModalRemoveClient from 'Modales/ModalRemoveClient'

const HamburgerButton = () => {

  const { handleModalPago } = useContext(AppContext)

  const location = useLocation()
  const history = useHistory()
  const params = location.pathname.split('/')
  
  const idPoject = () => {
    if (params.includes('proyecto')) {
      return params[params.length - 2]
      
    }
  }
  
  const [openHamburger, setOpenHAmburger] = useState(true)
  const toggleHaburger = () => setOpenHAmburger(!openHamburger)
  
  const [openProject, setOpenProject] = useState(false)
  const handleProjectModal = () => {
    setOpenProject(!openProject)
    toggleHaburger()
  }

  const nuevoLoteClient = () => {
    history.push({ pathname: `/add/proyecto/${idPoject()}/cliente/nuevo`, state: { proyecto: idPoject() } })
    toggleHaburger()
  }
  
  const [handleAddUser, setHandledAddUser] = useState(false)
  const toogleHandledUser = () => {
    setHandledAddUser(!handleAddUser)
    toggleHaburger()
  }

  const modalPagoBurger = () => {
    handleModalPago()
    toggleHaburger()
  }

  const [removeModal, setRemoveModal] = useState(false)
  const handleRemoveUser = () => {
    setRemoveModal(!removeModal)
    toggleHaburger()
  }

  return (
    <>
      <div 
        id='hamburgerBtn' 
        onClick={toggleHaburger}
        className={ openHamburger ? 'hamburger_btn' : 'hamburger_btn hamburger_btn_open'}>
        <div/>
        <div/>
        <div/>
    </div>
    <div hidden={openHamburger} className="menu__hiden__hamburger">

      <nav className="menu__hamburger">

        <h4>Buscar usuario</h4>
        <Buscador></Buscador>
        <hr/>
        { location.pathname === '/' &&
        <>
          <button className="menu__hamburger__btn__red">
          <div className="ico__user__morosos"></div>
            Usuarios Morosos
          </button>
          <div className="separacion__menu" />
          <button 
            className="btn__esmeralda"
            onClick={() => handleProjectModal()}>
              <div className="ico__proyecto" ></div>
              Añadir Proyecto
          </button>
          <button
            className="btn__esmeralda"
            >
            <div className="ico__editar"></div>
            Editar Proyecto
          </button>        
        </>
        }

        { params.includes('proyecto') && !params.includes('cliente') && 
        <>
          <button
          onClick={() => nuevoLoteClient()}
          className="btn__esmeralda"
          >
          <div className="ico__user"></div>
            Nuevo Cliente
          </button>

          <button
          onClick={toogleHandledUser}
          className="btn__esmeralda"
          >
          <div className="ico__user__normal"></div>
            Agregar Cliente
          </button>
          
          <div className="separacion__menu" />
          <button 
            onClick={handleRemoveUser}
            className="menu__hamburger__btn__red">
            <div className="ico__user__morosos"></div>
              Remover Cliente
          </button>
        </>
        }

        {
          params.includes('lote') && params.includes('cliente') && params.includes('projecto') &&
        <>
          <button
            className="btn__esmeralda"
            onClick={() => modalPagoBurger()}
            >
            <div className="invoice__ico"></div>
            Generar Pago
          </button>

          <div className="separacion__menu" />
        </>
        }

      </nav>
    </div>
    <NuevoPoject visible={openProject} onCancel={handleProjectModal} />
    <ModalAddUserProject visible={handleAddUser} onCancel={setHandledAddUser} />
    <ModalRemoveClient visible={removeModal} onCancel={handleRemoveUser} />
  </>
  )
}

export default HamburgerButton
