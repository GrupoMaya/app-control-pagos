import { useState, useMemo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useProject } from '@/hooks/api/useProjects'
import { useAllClients } from '@/hooks/api/useClients'
import { useAssignLoteToNewUser, useAddLoteToUser } from '@/hooks/api/useLotes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import ModalUserSearch from '@/Modales/ModalUserSearch'
import { notifySuccess } from '@/utils/Notify'

export default function ClienteDataForm () {
  const { idProyecto } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { proyecto, user } = location.state || {}

  const defaultValues = user
    ? {
        nombre: user?.nombre || '',
        address: user?.address || '',
        phone: user?.phone || '',
        email: user?.email || ''
      }
    : { nombre: '', address: '', phone: '', email: '' }

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({ defaultValues })

  const { data: allClients = [] } = useAllClients()
  const { data: project } = useProject(proyecto)

  const [matchVisible, setMatchVisible] = useState(false)
  const onCloseMatch = () => setMatchVisible(prev => !prev)
  const userKeyword = watch('nombre')

  const isUserMatch = useMemo(() => {
    if (!userKeyword || userKeyword.length < 3) return []
    const regex = new RegExp(userKeyword, 'gi')
    return allClients.filter(({ nombre }) => nombre?.match(regex))
  }, [userKeyword, allClients])

  const [showLote, setShowLote] = useState(false)

  const assignNew = useAssignLoteToNewUser()
  const assignExisting = useAddLoteToUser()

  const onSubmit = async (data) => {
    if (user) {
      await assignExisting.mutateAsync({
        idProyecto,
        payload: { ...data, idUser: user._id }
      })
    } else {
      await assignNew.mutateAsync({ projectId: idProyecto, payload: data })
    }
    notifySuccess('Cliente guardado', 'El cliente ha sido guardado correctamente')
    reset()
  }

  useEffect(() => {
    if (assignNew.isSuccess || assignExisting.isSuccess) {
      reset()
    }
  }, [assignNew.isSuccess, assignExisting.isSuccess, reset])

  return (
    <div className="cliente__App__container container mx-auto p-6">
      <div className="cliente__App__header mb-4">
        <h4 className="text-xl font-bold">
          Añadir usuario <br /> proyecto: {project?.title}
        </h4>
      </div>

      {(assignNew.isError || assignExisting.isError) && (
        <span className="notification__error text-destructive">El usuario ya existe</span>
      )}

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <fieldset className="space-y-4">
              <legend
                className="text-lg font-semibold cursor-pointer"
                onClick={() => {}}
              >
                Datos del Cliente
              </legend>

              <div className="space-y-2">
                <Label>Nombre Completo</Label>
                <Input {...register('nombre', { required: true })} />
                {errors.nombre && <span className="text-xs text-destructive">Campo Obligatorio</span>}
                {isUserMatch.length > 0 && userKeyword.length >= 4 && (
                  <p
                    className="text-sm font-bold cursor-pointer"
                    onClick={onCloseMatch}
                  >{`Existen ${isUserMatch.length} con ese nombre, clic aquí para ver`}</p>
                )}
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
                <Label>Email</Label>
                <Input type="email" {...register('email', { required: true })} />
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Regresar
                </Button>
                <Button type="submit">Guardar</Button>
                <Button type="button" variant="secondary" onClick={() => reset()}>
                  Borrar Campos
                </Button>
              </div>
            </fieldset>

            <Separator />

            <fieldset className="space-y-4">
              <legend
                className="text-lg font-semibold cursor-pointer"
                onClick={() => setShowLote(!showLote)}
              >
                Asignación de Lote
              </legend>

              <div hidden={!showLote} className="space-y-4">
                <div className="space-y-2">
                  <Label>Inicio de Contrato</Label>
                  <Input type="date" {...register('inicioContrato', { required: !user })} />
                </div>

                <div className="space-y-2">
                  <Label>Número de Lote</Label>
                  <Input type="number" min={0} {...register('lote', { required: !user, min: 1 })} />
                </div>

                <div className="space-y-2">
                  <Label>Número de Manzana</Label>
                  <Input type="text" {...register('manzana')} />
                </div>

                <div className="space-y-2">
                  <Label>Precio Total</Label>
                  <Input type="number" min={0} {...register('precioTotal', { required: !user })} />
                </div>

                <div className="space-y-2">
                  <Label>Enganche</Label>
                  <Input type="number" min={0} {...register('enganche', { required: !user })} />
                </div>

                <div className="space-y-2">
                  <Label>Monto financiamiento</Label>
                  <Input type="number" min={0} {...register('financiamiento', { required: !user })} />
                </div>

                <div className="space-y-2">
                  <Label>Plazo (Total de Meses)</Label>
                  <Input type="number" min={0} {...register('plazo', { required: !user, min: 1 })} />
                </div>

                <div className="space-y-2">
                  <Label>Mensualidad</Label>
                  <Input type="number" min={0} {...register('mensualidad', { required: !user })} />
                </div>
              </div>
            </fieldset>
          </form>
        </CardContent>
      </Card>

      <ModalUserSearch
        visible={matchVisible}
        dataResult={{ context: { busqueda: isUserMatch } }}
        onCancel={onCloseMatch}
      />
    </div>
  )
}
