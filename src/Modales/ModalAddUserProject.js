import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '@/context/AppContextProvider'
import { useSearchClients } from '@/hooks/api/useClients'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

export default function ModalAddUserProject ({ visible, onCancel }) {
  const { toggleDrawerNewUser } = useAppContext()
  const { register, handleSubmit, reset } = useForm()
  const searchMutation = useSearchClients()
  const location = useLocation()
  const navigate = useNavigate()

  const submitUser = (data) => {
    searchMutation.mutate(data.keyword)
  }

  const goToUser = (user) => {
    const idProject = location.pathname.split('/')[2]
    navigate(`/detalle/cliente/${user._id}`, {
      state: { proyecto: idProject, user }
    })
  }

  useEffect(() => {
    if (!visible) {
      reset()
      searchMutation.reset()
    }
  }, [visible, reset, searchMutation])

  const busqueda = searchMutation.data ? Object.values(searchMutation.data) : []

  return (
    <Dialog open={visible} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Añadir Usuario Existente</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitUser)} className="flex gap-2 mb-4">
          <Input
            placeholder="Buscar nombre del cliente"
            type="search"
            {...register('keyword')}
          />
          <Button type="submit">Buscar</Button>
        </form>

        {searchMutation.isSuccess && busqueda.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre Completo</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {busqueda.map(user => (
                <TableRow key={user._id}>
                  <TableCell>{user.nombre}</TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => goToUser(user)}>Agregar</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div className="mt-4">
          <Button
            onClick={() => {
              toggleDrawerNewUser()
              onCancel(false)
            }}
          >
            Añadir Nuevo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
