import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

export default function ModalUserSearch ({ visible, onCancel, dataResult }) {
  const navigate = useNavigate()
  const busqueda = dataResult?.context?.busqueda || []

  const goToUser = (_id) => {
    navigate(`/detalle/cliente/${_id}`)
    onCancel()
  }

  return (
    <Dialog open={visible} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Resultados de la búsqueda</DialogTitle>
        </DialogHeader>

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
                  <Button size="sm" onClick={() => goToUser(user._id)}>Ir</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  )
}
