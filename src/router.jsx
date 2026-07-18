import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router-dom'
import { QueryProvider } from '@/providers/QueryProvider'
import { UserContextProvider, useUserState } from '@/context/userContext'
import { AppContextProvider } from '@/context/AppContextProvider'
import { Toaster } from '@/components/ui/sonner'
import Sidebar from '@/components/layout/Sidebar'
import Login from '@/views/Login'
import Dashboard from '@/views/Dashboard'
import Proyecto from '@/views/Proyecto'
import Cliente from '@/views/Cliente'
import ClienteFluid from '@/views/ClienteFluid'
import ClienteDataForm from '@/views/ClienteDataForm'
import ClientDetail from '@/views/ClientDetail'
import Morosos from '@/views/Morosos'

function RootLayout () {
  const { pathname } = useLocation()
  const isLogin = pathname === '/login'

  return (
    <QueryProvider>
      <UserContextProvider>
        <AppContextProvider>
          <div className="flex h-screen w-full overflow-hidden bg-background">
            {!isLogin && <Sidebar />}
            <div className="flex-1 flex flex-col min-w-0">
              <Outlet />
            </div>
            <Toaster position="top-right" richColors />
          </div>
        </AppContextProvider>
      </UserContextProvider>
    </QueryProvider>
  )
}

function RequireAuth ({ children }) {
  const { user, loading } = useUserState()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return children
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: 'login',
        element: <Login />
      },
      {
        index: true,
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        )
      },
      {
        path: 'proyecto/:slug/:projectName',
        element: (
          <RequireAuth>
            <Proyecto />
          </RequireAuth>
        )
      },
      {
        path: 'detalle/lote/:idlote/cliente/:clienteSlug/projecto/:projectSlug',
        element: (
          <RequireAuth>
            <ClienteFluid />
          </RequireAuth>
        )
      },
      {
        path: 'cliente/:slug',
        element: (
          <RequireAuth>
            <Cliente />
          </RequireAuth>
        )
      },
      {
        path: 'add/proyecto/:idProyecto/cliente/:idCliente',
        element: (
          <RequireAuth>
            <ClienteDataForm />
          </RequireAuth>
        )
      },
      {
        path: 'detalle/cliente/:id',
        element: (
          <RequireAuth>
            <ClientDetail />
          </RequireAuth>
        )
      },
      {
        path: 'morosos',
        element: (
          <RequireAuth>
            <Morosos />
          </RequireAuth>
        )
      }
    ]
  }
])
