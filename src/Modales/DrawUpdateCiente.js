import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { usePatchClient } from '@/hooks/api/useClients'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function DrawUpdateCiente ({ dataClient, isOpen, setIsOpen }) {
  const { id } = useParams()
  const patchClient = usePatchClient()
  const [loading, setLoading] = useState(false)

  const { handleSubmit, control, watch } = useForm({
    defaultValues: { nombre: dataClient?.nombre || '' }
  })

  const nombreWatch = watch('nombre')

  const onSubmit = async (body) => {
    setLoading(true)
    await patchClient.mutateAsync({ id: dataClient?._id || id, body })
    setLoading(false)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambiar nombre</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-end gap-2 mt-4">
          <div className="flex-1">
            <Label htmlFor="nombre">Nombre</Label>
            <Controller
              control={control}
              name="nombre"
              render={({ field }) => <Input {...field} />}
            />
          </div>
          <Button
            type="submit"
            disabled={dataClient?.nombre === nombreWatch || loading}
            loading={loading}
          >
            Guardar
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancelar</Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  )
}
