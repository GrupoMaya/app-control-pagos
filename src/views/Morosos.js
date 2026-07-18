import { useMemo } from 'react'
import { useMorosos } from '@/hooks/api/useMorosos'
import TablaMorosos from '@/Components/Morosos/TablaMorosos'
import { Skeleton } from '@/components/ui/skeleton'

export default function Morosos () {
  const { data: morosos, isLoading } = useMorosos()

  const treinta = useMemo(() => morosos?.treinta_dias || {}, [morosos])
  const sesenta = useMemo(() => morosos?.sesenta_dias || {}, [morosos])

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Clientes Morosos</h1>
        <p className="text-muted-foreground">
          Lista de clientes con 30 días y más de 60 días desde su último pago.
        </p>
        <p className="text-sm text-muted-foreground">
          Selecciona una fila para ir a la pantalla de pagos.
        </p>
      </div>

      {isLoading && (
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-40 w-full" />
        </div>
      )}

      {!isLoading && (
        <>
          <TablaMorosos
            data={treinta}
            title="Clientes con más de 30 días de su último pago"
          />
          <TablaMorosos
            data={sesenta}
            title="Clientes con más de 60 días de su último pago"
          />
        </>
      )}
    </div>
  )
}
