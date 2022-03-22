import { lazy, Suspense } from 'react'
import './Styles/index.scss'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { MayaAppMachineProvider } from 'context/MayaMachine'
import AppContextProvider from 'context/AppContextProvider'
import MenuMaya from 'Components/MenuMaya'
import PrivateRoutesContainer from 'Components/PrivetRoutes'
import { UserContextProvider } from 'context/userContext'
const Login = lazy(() => import('views/Login'))

function App () {
  return (
    <div className="App">
      <Router>
        <Switch>
          <MayaAppMachineProvider>
          <AppContextProvider>
            <UserContextProvider>

              <header className="App-header">
                <MenuMaya />
                <a href="/" >
                <span></span>
                </a>
              </header>

              <div className="App-container">
                  <Suspense fallback={<div>Loading user...</div>}>
                    <Route
                      exact
                      path="/login"
                      name="login"
                      render={(props) => <Login {...props} /> }
                    />
                  </Suspense>
                  {/* todas las rutas */}
                  <PrivateRoutesContainer />
                <div className="cliente_App_footer" />
              </div>

          </UserContextProvider>
          </AppContextProvider>
          </MayaAppMachineProvider>
        </Switch>
      </Router>
    
    </div>
  )
}

export default App
