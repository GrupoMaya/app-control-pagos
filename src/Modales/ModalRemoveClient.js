import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
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
import { useSearchClients, useClientDetail } from '@/hooks/api/useClients'
import { usePatchLote } from '@/hooks/api/useLotes'

export default function ModalRemoveClient ({ visible, onCancel }) {
  const { register, handleSubmit, reset } = useForm()
  const [selectedClient, setSelectedClient] = useState(null)
  const searchMutation = useSearchClients()
  const patchLote = usePatchLote()
  const { data: detail } = useClientDetail(selectedClient?._id)

  const submitSearch = (data) => {
    searchMutation.mutate(data.keyword)
    setSelectedClient(null)
  }

  const handleRemove = (lote) => {
    patchLote.mutate(
      { id: lote._id, payload: { isActive: false, proyecto: lote.proyecto } },
      {
        onSuccess: () => {
          toast.success('Cliente removido del lote')
        },
        onError: () => {
          toast.error('No se pudo remover el cliente del lote')
        }
      }
    )
  }

  useEffect(() => {
    if (!visible) {
      reset()
      setSelectedClient(null)
      searchMutation.reset()
    }
  }, [visible, reset, searchMutation])

  const results = searchMutation.isSuccess
    ? Object.values(searchMutation.data)
    : []

  return (
    <Dialog open={visible} onOpenChange={onCancel}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Remover cliente de lote</DialogTitle>
        </DialogHeader>

        {searchMutation.isError && (
          <p className="text-sm text-red-500">
            No hay usuarios que coincidan con tu búsqueda
          </p>
        )}

        <form onSubmit={handleSubmit(submitSearch)} className="flex gap-2">
          <Input
            placeholder="Buscar por nombre"
            {...register('keyword')}
          />
          <Button type="submit">Buscar</Button>
        </form>

        {results.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.nombre}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => setSelectedClient(user)}
                    >
                      Seleccionar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {selectedClient && detail && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">
              Lotes activos de {selectedClient.nombre}
            </h4>
            {detail.lotes?.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lote</TableHead>
                    <TableHead>Proyecto</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detail.lotes.map((lote) => (
                    <TableRow key={lote._id}>
                      <TableCell>{lote.lote}</TableCell>
                      <TableCell>{lote.proyecto?.title || lote.proyecto}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={patchLote.isPending}
                          onClick={() => handleRemove(lote)}
                        >
                          Remover
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">
                Este cliente no tiene lotes activos.
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
