import { useState, useContext } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import DrawerAddUser from './DrawerAddUser'

import NuevoPoject from 'Modales/NuevoProject'
import Buscador from './Buscador'

// contexto
import { AppContext } from 'context/AppContextProvider'
import ModalAddUserProject from 'Modales/ModalAddUserProject'
import ModalSettings from 'Modales/ModalSettings'
import { UserState, UserDispatch } from 'context/userContext'

const MenuMaya = () => {

  const { handleModalPago, openDrawerNewUser, setOpenDrawerNewUser } = useContext(AppContext)

  const location = useLocation()
  const history = useHistory()
  const params = location.pathname.split('/')
  
  const [openHamburger, setOpenHAmburger] = useState(true)
  const toggleHaburger = () => setOpenHAmburger(!openHamburger)
  
  const [openProject, setOpenProject] = useState(false)
  const handleProjectModal = () => {
    setOpenProject(!openProject)
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
  
  const handleRemoveUser = () => {
    history.push('/morosos')
    toggleHaburger()
  }

  const [settingsModal, setSettingsModal] = useState(false)
  const toogleSettingsModal = () => {
    setSettingsModal(!settingsModal)
    toggleHaburger()
  }

  const { state } = UserState()
  const { user } = state.context

  const dispatch = UserDispatch()
  
  const handleLogoutBtn = () => {
    dispatch('LOGOUT')
    toggleHaburger()
  }

  return (
    <>
      {
        user && (
          <div
            id='hamburgerBtn'
            onClick={toggleHaburger}
            className={ openHamburger ? 'hamburger_btn' : 'hamburger_btn hamburger_btn_open'}>
            <div/>
            <div/>
            <div/>
          </div>
        )
      }
    <div hidden={openHamburger} className="menu__hiden__hamburger">

      <nav className="menu__hamburger">
        <p style={{
          color: '#ffff',
          fontSize: '18px'
        }}>
          { user?.name ? `Bienvenido, ${user?.name}` : null }
        </p>
        <div className="separacion__menu" />
        <Buscador></Buscador>
        <hr/>
        { location.pathname === '/' &&
        <>
          
          {
            user?.role === 'admin' && (
              <button
                className="bg__blue"
                onClick={() => toogleSettingsModal()}
                >
                <div className="ico__settings"></div>
                Configuración
              </button>
            )
          }

          <button
            onClick={() => handleRemoveUser()}
            className="menu__hamburger__btn__red"
          >
          <div className="ico__user__morosos"></div>
            Usuarios Morosos
          </button>

          <div className="separacion__menu" />

         {
           user?.role === 'admin' && (
             <button
             className="btn__esmeralda"
             onClick={() => handleProjectModal()}>
                <div className="ico__proyecto" ></div>
                Añadir Proyecto
            </button>
           )
         }
        </>
        }

        { params.includes('proyecto') && !params.includes('cliente') &&
          user?.role === 'admin' && (
        <>
          {/* <button
          onClick={() => nuevoLoteClient()}
          className="btn__esmeralda"
          >
          <div className="ico__user"></div>
            Nuevo Cliente
          </button> */}

          <button
            onClick={toogleHandledUser}
            className="btn__esmeralda"
            >
            <div className="ico__user__normal"></div>
              Agregar Cliente
          </button>
        </>)
        }

        {
          params.includes('lote') && params.includes('cliente') && params.includes('projecto') &&
          user?.role === 'admin' && (
            <>
          <button
            className="btn__esmeralda"
            onClick={() => modalPagoBurger()}
            >
            <div className="invoice__ico"></div>
            Generar Pago
          </button>

          <div className="separacion__menu" />
        </>)
        }
      <div className="separacion__menu" />
      <button
        onClick={() => handleLogoutBtn()}
        className="bg-magenta">
      <div className="ico__salir"></div>
        Salir
      </button>

      </nav>
    </div>
    <NuevoPoject visible={openProject} onCancel={handleProjectModal} />
    <ModalAddUserProject visible={handleAddUser} onCancel={setHandledAddUser} />
    <ModalSettings visible={settingsModal} onCancel={toogleSettingsModal} />
    <DrawerAddUser visible={openDrawerNewUser} onCancel={setOpenDrawerNewUser} />
  </>
  )
}

export default MenuMaya
