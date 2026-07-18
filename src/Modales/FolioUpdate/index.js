import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { useUpdateFolio } from '@/hooks/api/usePagos'

export default function FolioUpdate ({ document, onClose }) {
  const [open, setOpen] = useState(false)
  const [newFolio, setNewFolio] = useState(document?.folio || '')
  const [consecutivo, setConsecutivo] = useState(false)
  const updateFolio = useUpdateFolio()

  const handleUpdate = () => {
    if (newFolio === '') {
      toast.error('El folio no puede estar vacío')
      return
    }

    updateFolio.mutate(
      { id: document._id, folio: Number(newFolio), fixConsecutive: consecutivo },
      {
        onSuccess: (res) => {
          if (res?.error) {
            toast.error('No se pudo actualizar el folio')
            return
          }
          toast.success('Folio actualizado correctamente')
          setOpen(false)
          onClose()
        },
        onError: () => {
          toast.error('No se pudo actualizar el folio')
        }
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="destructive" className="w-full">
          Modificar Folio
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Modificar Folio</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 items-center">
          <div className="grid gap-2 w-full">
            <Label htmlFor="folio">Folio</Label>
            <Input
              id="folio"
              type="text"
              defaultValue={document?.folio}
              onChange={(e) => setNewFolio(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="consecutivo"
              checked={consecutivo}
              onCheckedChange={(checked) => setConsecutivo(Boolean(checked))}
            />
            <Label htmlFor="consecutivo">¿El siguiente folio será consecutivo?</Label>
          </div>

          <Button
            type="button"
            onClick={handleUpdate}
            disabled={updateFolio.isPending}
            className="w-full"
          >
            Modificar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
