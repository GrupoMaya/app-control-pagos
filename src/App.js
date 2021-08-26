import './Styles/index.scss'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import 'Components/CardProyectos'

import Dashboard from 'views/Dashboard'
import Proyecto from 'views/Proyecto'
import Cliente from 'views/Cliente'
import ClienteFluid from 'views/ClienteFluid'
import ClienteDataForm from 'views/ClienteDataForm'

import { MayaAppMachineProvider } from 'context/MayaMachine'
import AppContextProvider from 'context/AppContextProvider'

import HamburgerButton from 'Components/HamburgerButton'

function App () {
  return (
    <div className="App">
      <Router>
        <Switch>
          <MayaAppMachineProvider>
          <AppContextProvider>

          <header className="App-header">
              <a href="/" >
              <span></span>
              </a>
              <HamburgerButton></HamburgerButton>
            </header>
      <div className="App-container">
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

      </div>
          </AppContextProvider>
          </MayaAppMachineProvider>
        </Switch>
      </Router>
    </div>
  )
}

export default App
