import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUserState, useUserDispatch } from '@/context/userContext'
import { useAppContext } from '@/context/AppContextProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { useSearchClients } from '@/hooks/api/useClients'
import NuevoProject from '@/Modales/NuevoProject'
import ModalAddUserProject from '@/Modales/ModalAddUserProject'
import ModalSettings from '@/Modales/ModalSettings'
import DrawerAddUser from '@/Components/DrawerAddUser'

export default function MenuMaya () {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useUserState()
  const { logout } = useUserDispatch()
  const {
    handleModalPago,
    openDrawerNewUser,
    setOpenDrawerNewUser,
    toggleDrawerNewUser,
    plataformName
  } = useAppContext()

  const [open, setOpen] = useState(false)
  const [openProject, setOpenProject] = useState(false)
  const [openAddUser, setOpenAddUser] = useState(false)
  const [openSettings, setOpenSettings] = useState(false)

  const searchMutation = useSearchClients()

  const handleSearch = async (e) => {
    e.preventDefault()
    const keyword = e.target.keyword.value
    if (!keyword) return
    try {
      const results = await searchMutation.mutateAsync(keyword)
      const first = Object.values(results)[0]
      if (first) {
        navigate(`/cliente/${first._id}`)
        setOpen(false)
      }
    } catch {
      // handled by mutation error
    }
  }

  if (!user) return null

  const isAdmin = user?.role === 'admin'

  return (
    <>
      <header className="App-header flex items-center justify-between px-4 py-2 bg-card border-b">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="hamburger_btn">
              <span className="sr-only">Menú</span>
              <div className="space-y-1">
                <div className="w-6 h-0.5 bg-foreground" />
                <div className="w-6 h-0.5 bg-foreground" />
                <div className="w-6 h-0.5 bg-foreground" />
              </div>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Bienvenido, {user?.name}</SheetTitle>
            </SheetHeader>

            <div className="py-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input name="keyword" placeholder="Buscar cliente..." />
                <Button type="submit" size="sm">Buscar</Button>
              </form>
            </div>

            <Separator className="my-4" />

            <nav className="space-y-2">
              {location.pathname === '/' && (
                <>
                  {isAdmin && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => { setOpenSettings(true); setOpen(false) }}
                    >
                      Configuración
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => { navigate('/morosos'); setOpen(false) }}
                  >
                    Usuarios Morosos
                  </Button>
                  <Separator className="my-2" />
                  {isAdmin && (
                    <Button
                      className="w-full justify-start"
                      onClick={() => { setOpenProject(true); setOpen(false) }}
                    >
                      Añadir Proyecto
                    </Button>
                  )}
                </>
              )}

              {location.pathname.startsWith('/proyecto/') && isAdmin && (
                <Button
                  className="w-full justify-start"
                  onClick={() => { setOpenAddUser(true); setOpen(false) }}
                >
                  Agregar Cliente
                </Button>
              )}

              {location.pathname.includes('/detalle/lote/') && isAdmin && (
                <Button
                  className="w-full justify-start"
                  onClick={() => { handleModalPago(); setOpen(false) }}
                >
                  Generar Pago
                </Button>
              )}

              <Separator className="my-4" />
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={() => { logout(); setOpen(false) }}
              >
                Salir
              </Button>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">{plataformName || 'Grupo Maya'}</h1>
        </div>

        <a href="/" className="invisible">Inicio</a>
      </header>

      <NuevoProject visible={openProject} onCancel={setOpenProject} />
      <ModalAddUserProject visible={openAddUser} onCancel={setOpenAddUser} />
      <ModalSettings visible={openSettings} onCancel={setOpenSettings} />
      <DrawerAddUser visible={openDrawerNewUser} onCancel={setOpenDrawerNewUser} />
    </>
  )
}
