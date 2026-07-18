import { useState } from 'react'
import { useUpdateProject } from '@/hooks/api/useProjects'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { notifyInfo, notifySuccess } from '@/utils/Notify'

export default function ModalProyectName ({ open, handleCloseModal, proyectName, id }) {
  const updateProject = useUpdateProject()
  const [currentName, setCurrentName] = useState(proyectName)

  const handledFormEdit = async (e) => {
    e.preventDefault()

    if (currentName === proyectName) {
      notifyInfo('No hay cambios', 'No se ha detectado ningún cambio')
      return
    }

    try {
      const res = await updateProject.mutateAsync({ id, payload: { title: currentName } })
      if (res.message?.isActive === true) {
        window.location.reload()
      } else {
        notifySuccess('Nombre actualizado', 'El nombre del proyecto se actualizó correctamente')
        handleCloseModal()
      }
    } catch {
      notifyInfo('Error', 'No se pudo actualizar el nombre')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleCloseModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Nombre del proyecto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handledFormEdit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="proyectName">Nombre del proyecto</Label>
            <Input
              id="proyectName"
              value={currentName}
              onChange={(e) => setCurrentName(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={updateProject.isPending}>Guardar</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
