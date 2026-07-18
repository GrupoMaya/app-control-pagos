import './sytles.scss'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { useAssignLoteToNewUser } from '@/hooks/api/useLotes'
import { useLotes } from '@/hooks/api/useLotes'
import { useAppContext } from '@/context/AppContextProvider'
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

export default function DrawerAddUser ({ visible, onCancel }) {
  const { slug } = useParams()
  const idProyecto = slug
  const uuid = uuidv4()

  const addUser = useAssignLoteToNewUser()
  const { toggleDrawerNewUser } = useAppContext()

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: { email: uuid }
  })

  const loteSelected = watch('lote')
  const manzanaSelected = watch('manzana')

  const { data: getUsers = [] } = useLotes(idProyecto)

  const isMatchLote = useMemo(() => {
    if (!Array.isArray(getUsers) || !loteSelected || !manzanaSelected) return false
    return getUsers.some(({ lote, manzana }) => lote === loteSelected && manzana === manzanaSelected)
  }, [loteSelected, manzanaSelected, getUsers])

  const onSubmit = async (data) => {
    await addUser.mutateAsync({ projectId: idProyecto, payload: data })
    notifySuccess('Cliente guardado', 'El cliente ha sido guardado correctamente')
    toggleDrawerNewUser()
    onCancel(false)
    reset()
  }

  useEffect(() => {
    return () => reset()
  }, [reset])

  return (
    <Sheet open={visible} onOpenChange={onCancel}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Crear nuevo cliente</SheetTitle>
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
              <Label>Dirección</Label>
              <Input {...register('address', { required: true })} />
            </div>

            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input {...register('phone', { required: true })} />
            </div>

            <div className="space-y-2">
              <Label>ID Cliente</Label>
              <Input disabled {...register('email', { required: true })} />
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
              <Button type="button" variant="outline" onClick={() => onCancel(false)}>Cancelar</Button>
              <Button type="submit" disabled={!!isMatchLote || addUser.isPending}>
                {addUser.isPending ? 'Guardando...' : 'Guardar'}
              </Button>
            </SheetFooter>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
