import './sytles.scss'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAddLoteToUser } from '@/hooks/api/useLotes'
import { useProjects } from '@/hooks/api/useProjects'
import { useLotes } from '@/hooks/api/useLotes'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { notifySuccess } from '@/utils/Notify'

export default function DrawerAddLote ({ dataClient, isOpen, setIsOpen }) {
  const addLote = useAddLoteToUser()
  const { data: projects = [] } = useProjects()

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: { ...dataClient }
  })

  const loteSelected = watch('lote')
  const proyectoSelected = watch('idProyecto')
  const manzanaSelected = watch('manzana')

  const { data: getUsers = [] } = useLotes(proyectoSelected)

  const isMatchLote = useMemo(() => {
    if (!Array.isArray(getUsers) || !loteSelected || !manzanaSelected) return false
    return getUsers.some(({ lote, manzana }) => lote === loteSelected && manzana === manzanaSelected)
  }, [loteSelected, manzanaSelected, getUsers])

  const onSubmit = async (data) => {
    await addLote.mutateAsync({
      idProyecto: data.idProyecto,
      payload: { ...data, idUser: dataClient._id }
    })
    notifySuccess('Lote añadido', 'El lote se ha guardado correctamente')
    reset()
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Añadir nuevo lote</SheetTitle>
        </SheetHeader>

        <div className="py-4">
          {isMatchLote && (
            <span className="alert__lote text-destructive text-sm">
              {`Ya existe el lote: ${loteSelected}`}
            </span>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre Completo</Label>
              <Input {...register('nombre', { required: true })} />
              {errors.nombre && <span className="text-xs text-destructive">Campo obligatorio</span>}
            </div>

            <div className="space-y-2">
              <Label>Selecciona Proyecto</Label>
              <select
                className="w-full border rounded-md p-2"
                {...register('idProyecto')}
              >
                <option value=""></option>
                {projects.map(project => (
                  <option key={project._id} value={project._id}>
                    {project.title.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>ID Cliente</Label>
              <Input disabled {...register('email')} />
            </div>

            <Separator />
            <h6>Datos del lote del cliente</h6>

            <div className="space-y-2">
              <Label>Inicio de Contrato</Label>
              <Input type="date" {...register('inicioContrato', { required: true })} />
            </div>

            <div className="space-y-2">
              <Label>Número de Lote</Label>
              <Input type="number" min={0} {...register('lote', { required: true, min: 1 })} />
              {errors.lote && <span className="text-xs text-destructive">Ingrese un número válido</span>}
            </div>

            <div className="space-y-2">
              <Label>Número de Manzana</Label>
              <Input type="text" {...register('manzana')} />
            </div>

            <div className="space-y-2">
              <Label>Precio Total</Label>
              <Input type="number" min={0} {...register('precioTotal', { required: true })} />
            </div>

            <div className="space-y-2">
              <Label>Enganche</Label>
              <Input type="number" min={0} {...register('enganche', { required: true })} />
            </div>

            <div className="space-y-2">
              <Label>Monto financiamiento</Label>
              <Input type="number" min={0} {...register('financiamiento', { required: true })} />
            </div>

            <div className="space-y-2">
              <Label>Plazo (Total de Meses)</Label>
              <Input type="number" min={0} {...register('plazo', { required: true, min: 1 })} />
            </div>

            <div className="space-y-2">
              <Label>Mensualidad</Label>
              <Input type="number" min={0} {...register('mensualidad', { required: true })} />
            </div>

            <SheetFooter className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={!!isMatchLote || addLote.isPending}>
                {addLote.isPending ? 'Guardando...' : 'Guardar'}
              </Button>
            </SheetFooter>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
