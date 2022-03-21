import { useEffect } from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'
import Dashboard from 'views/Dashboard'
import Proyecto from 'views/Proyecto'
import Cliente from 'views/Cliente'
import ClienteFluid from 'views/ClienteFluid'
import ClienteDataForm from 'views/ClienteDataForm'
import ClientDetail from 'views/ClientDetail'
import Morosos from 'views/Morosos'
import { UserState } from 'context/userContext'

// ClienteFluid es el componente principal de informacion de pagos

const PrivateRoutesContainer = () => {

  const { state } = UserState()
  const { user } = state?.context
  const { push } = useHistory()

  useEffect(() => {
    if (user) {
      return user
    } else if (user === undefined) {
      return push('/login')
    }
  }, [state])

  const amojis = ['🔥', '😁', '🚀', '❤️', '💀', '🥲', '🖖', '🙈', '👽', '👾', '🤖']
  const saludo = () => {
    const date = Intl.DateTimeFormat('es-MX', { dateStyle: 'full' }).format(new Date())
    const day = Intl.DateTimeFormat('es-MX', { dayPeriod: 'short' }).format(new Date())
    const hour = Intl.DateTimeFormat('es-MX', { hour: 'numeric' }).format(new Date())
    const minute = Intl.DateTimeFormat('es-MX', { minute: 'numeric' }).format(new Date())
    const randomEmoji = amojis[Math.floor(Math.random() * amojis.length)]

    return `Hola, hoy es ${date} y son las ${hour}: ${minute} ${day}!!! ${randomEmoji}`
  }

  const routes = () => {
    return (
    <>
      <Route path="/" exact={true}>
        <Dashboard />
      </Route>

      <Route
        exact={true}
        path="/proyecto/:slug/:projectName"
        render={(props) => <Proyecto { ...props } />}
        >
      </Route>

      {/* Parte del flujo */}
      <Route
        exact={true}
        path="/detalle/lote/:idlote/cliente/:clienteSlug/projecto/:projectSlug"
        render={(props) => <ClienteFluid { ...props } />}
      >
      </Route>

      {/* complementarios */}
      <Route
        path="/cliente/:slug"
        render={(props) => <Cliente { ...props } />}
      >
      </Route>

      <Route
        path="/add/proyecto/:idProyecto/cliente/:idCliente"
        render={(props) => <ClienteDataForm { ...props } /> }
        >
      </Route>

      <Route
        path="/detalle/cliente/:id"
        render={(props) => <ClientDetail { ...props } /> }
      />

      <Route
        path="/morosos"
        render={(props) => <Morosos {...props} /> }
      />
    </>
    )
  }

  if (user) {
    return (
      <Switch>
        { routes() }
      </Switch>
    )
  } else {
    return (
      <div
        className='saludo_chistoso'
      >
        <h1>{
          saludo()
          }</h1>
      </div>
    )
  }
}

export default PrivateRoutesContainer
