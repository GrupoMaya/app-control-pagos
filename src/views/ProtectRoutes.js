import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
// import Dashboard from 'views/Dashboard'
import Dashboard from './Dashboard'
import Proyecto from 'views/Proyecto'
import Cliente from 'views/Cliente'
import ClienteFluid from 'views/ClienteFluid'
import ClienteDataForm from 'views/ClienteDataForm'
import ClientDetail from 'views/ClientDetail'
import { isLogin } from 'utils/auth'

const ProtectRoutes = () => {

  return (
    isLogin()
      ? (
      <Router>
      <Switch>
        <Route
          exact={true}
          path="/"
          render={(props) => <Dashboard { ...props } />}
          >
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

      </Switch>
    </Router>
        )
      : <p className='incia__sesion'>Inicia sesion para continuar</p>
  )
}

export default ProtectRoutes
