import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { UserState, UserDispatch } from 'context/userContext'
import { Redirect } from 'react-router'
import ErrorModal from 'Components/ErrorModal'

const Login = () => {
  const { state } = UserState()
  const dispatch = UserDispatch()

  const [openModal, setModal] = useState(false)
  const handleCloseModal = () => setModal(!openModal)
  const [message, setMessage] = useState([])

  const { register, watch, handleSubmit, formState: { errors } } = useForm()

  const userWatch = watch('email')
  const passwordWatch = watch('password')

  const onSubmit = (data) => {
    dispatch('LOGIN', { data })
  }

  const tokenUser = useMemo(() => {
    if (state.matches('success')) {
      return Boolean(localStorage.getItem('tokenUserSite'))
    }
  }, [state.value])
 
  useEffect(() => {
    
    if (state.matches('error') && userWatch && passwordWatch) {
      handleCloseModal()
      setMessage('Error en la contraseña o email')
    }
  }, [state])

  return (
    <div id="Login">
      <section>
        <div>
          {
            !tokenUser && (
              <form onSubmit={handleSubmit(onSubmit)}>
                <h1>Inicio de sesión</h1>
                <input
                  type="email"
                  id="email"
                  placeholder="Correo Electronico"
                  {...register('email', { required: true })}
                  />
                {errors.email && <span>This field is required</span>}
                <input
                  placeholder="Contraseña"
                  type="password"
                  id="password"
                  {...register('password', { required: true })}
                  />
                {errors.password && <span>This field is required</span>}
                <button>Entrar</button>
              </form>
            )
          }
        </div>
      </section>
      { tokenUser && <Redirect to="/"/>}
      { openModal && <ErrorModal
        message={message}
        open={openModal}
        handleCloseModal={handleCloseModal}
      /> }
      {
        state.matches(['login', 'auth', 'validate']) &&
          <span className="logo__loader__await" />
      }
    </div>
  )
}
export default Login
