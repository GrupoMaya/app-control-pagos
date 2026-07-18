import { useEffect, useState } from 'react'
import { baseURL } from '@/api/client'
import NumberFormat from '@/utils/NumberFormat'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

export default function ModalStatusProjectDetails ({ loteid, openModal, handledModal }) {
  const idLote = loteid?.length > 0 ? loteid[0].lote.toString() : null
  const [estatus, setEstatus] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!idLote) return
    setLoading(true)
    fetch(`${baseURL}/status/payment/lote/${idLote}`)
      .then(res => res.json())
      .then(res => setEstatus(res.message))
      .finally(() => setLoading(false))
  }, [idLote, loteid])

  const statusPagosPendiente = (payload) => {
    const plazo = payload[0]?.plazo
    const folioArray = payload[0]?.pagos.map(pago => pago.folio)
    const totalPagos = Array.isArray(folioArray) && folioArray.length > 0 ? Math.max(...folioArray) : 0
    const diffPagos = plazo - totalPagos
    return { totalPagos, plazo, diffPagos }
  }

  const financiamientoPendiente = (payload) => {
    const financiamiento = payload[0]?.precioTotal
    const pagoRealizado = payload[0]?.pagos
      .filter(item => item.status === true && item.tipoPago !== 'extra')
      .map(item => item.mensualidad?.$numberDecimal || item.mensualidad)
      .reduce((acc, val) => +acc + +val, 0)

    const intereses = payload[0]?.pagos
      .filter(item => item.status === true && item.tipoPago === 'extra')
      .map(item => item.mensualidad?.$numberDecimal || item.mensualidad)
      .reduce((acc, val) => +acc + +val, 0)

    const pagoPorRealizar = payload[0]?.pagos
      .filter(item => item.status === false)
      .map(item => item.mensualidad?.$numberDecimal || item.mensualidad)
      .reduce((acc, val) => +acc + +val, 0)

    const restante = financiamiento - pagoRealizado
    return { financiamiento, pagoRealizado, pagoPorRealizar, restante, intereses }
  }

  const plazoStatus = statusPagosPendiente(estatus)
  const financiamento = financiamientoPendiente(estatus)

  return (
    <Dialog open={openModal} onOpenChange={handledModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>RESUMEN DE PAGOS</DialogTitle>
        </DialogHeader>

        {loading && <Skeleton className="h-48 w-full" />}

        {!loading && estatus.length > 0 && (
          <section className="space-y-6">
            <h3 className="font-bold">Pagos</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plazo</TableHead>
                  <TableHead>Realizados</TableHead>
                  <TableHead>Restantes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{plazoStatus?.plazo}</TableCell>
                  <TableCell>{plazoStatus?.totalPagos}</TableCell>
                  <TableCell>{plazoStatus?.diffPagos}</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <h3 className="font-bold">Financiamiento</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total:</span>
                <span>{<NumberFormat number={financiamento?.financiamiento} />}</span>
              </div>
              <div className="flex justify-between">
                <span>Total pagos realizados:</span>
                <span>{<NumberFormat number={financiamento?.pagoRealizado} />}</span>
              </div>
              <div className="flex justify-between">
                <span>Intereses generados:</span>
                <span>{<NumberFormat number={financiamento?.intereses} />}</span>
              </div>
              <div className="flex justify-between">
                <span>Pagos pendientes:</span>
                <span>{<NumberFormat number={financiamento?.pagoPorRealizar} />}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total por pagar:</span>
                <span>{<NumberFormat number={financiamento?.restante} />}</span>
              </div>
            </div>
          </section>
        )}
      </DialogContent>
    </Dialog>
  )
}
