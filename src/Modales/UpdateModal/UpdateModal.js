import { useState } from 'react'
import { useUserState } from '@/context/userContext'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useLote } from '@/hooks/api/useLotes'
import { usePago } from '@/hooks/api/usePagos'
import LoteTemplate from './templates/LoteTemplate'
import PagoTemplate from './templates/PagoTemplate'

export default function UpdateModal ({ id, document }) {
  const [open, setOpen] = useState(false)
  const { user } = useUserState()

  const isAdmin = user?.role === 'admin'
  const isLote = document === 'Lote'
  const isPago = document === 'Pago'

  const loteQuery = useLote(isLote && open ? id : null)
  const pagoQuery = usePago(isPago && open ? id : null)

  const data = isLote ? loteQuery.data : isPago ? pagoQuery.data : null
  const isLoading = isLote ? loteQuery.isLoading : isPago ? pagoQuery.isLoading : false

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {isAdmin && (
        <DialogTrigger asChild>
          <Button variant="destructive" size="sm">Modificar</Button>
        </DialogTrigger>
      )}

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar datos del {document}</DialogTitle>
        </DialogHeader>

        {isLoading && <p className="text-sm text-muted-foreground">Cargando...</p>}

        {!isLoading && data && isLote && (
          <LoteTemplate data={data} onClose={() => setOpen(false)} />
        )}

        {!isLoading && data && isPago && (
          <PagoTemplate data={data} onClose={() => setOpen(false)} />
        )}
      </DialogContent>
    </Dialog>
  )
}
