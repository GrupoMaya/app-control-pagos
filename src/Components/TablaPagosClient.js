import { useState, useMemo } from 'react'
import { useAppContext } from '@/context/AppContextProvider'
import HookPagosTable from '@/hooks/HookPagosTable'
import ModalEstatus from './ModalEstatus'
import * as XLSX from 'xlsx'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export default function TablaPagosClient ({
  pagos: pagosData,
  lote,
  clienteInfo,
  downloadResumenExcel
}) {
  const { modalPago, setModalPago } = useAppContext()
  const [pagosSelected, setPagosSelected] = useState('all')

  const pagos = useMemo(() => {
    if (pagosSelected === 'all') return pagosData
    return pagosData.filter(pago => pago.tipoPago === pagosSelected)
  }, [pagosData, pagosSelected])

  const exportExcel = () => {
    if (pagos.length === 0) return
    const payloadToExport = pagos.map(pago => ({
      Fecha: pago.mes,
      pago: pago.mensualidad,
      Tipo_pago: pago.tipoPago,
      Numero_pago: pago.folio,
      cuenta: pago.ctaBancaria,
      fecha_deposito: pago.fechaPago,
      Referencia_Banco: pago.refBanco,
      Observaciones: `${pago.textoObservaciones || ''} ${pago.refPago || ''} ${pago.mensajeRecibo || ''}`
    }))

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(payloadToExport)
    XLSX.utils.book_append_sheet(wb, ws, 'Pagos')
    XLSX.writeFile(wb, `pagos_${lote}_${clienteInfo?.clienteSlug}.xlsx`)
  }

  return (
    <section className="cliente__App__pagos">
      <h3 className="text-xl font-bold mb-4">PAGOS</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        <Button variant="outline" onClick={exportExcel}>🗒️ Exportar Lista de pagos</Button>
        <Button variant="outline" onClick={downloadResumenExcel}>💾 ESTADO DE CUENTA</Button>
      </div>

      <ModalEstatus openModal={modalPago} handledStatusPago={setModalPago} />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Folio</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Estatus</TableHead>
            <TableHead>Referencia</TableHead>
            <TableHead>
              <Select value={pagosSelected} onValueChange={setPagosSelected}>
                <SelectTrigger className="w-[140px] select_gde">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="mensualidad">Mensualidad</SelectItem>
                  <SelectItem value="extra">Extra</SelectItem>
                  <SelectItem value="saldoinicial">Saldo Inicial</SelectItem>
                </SelectContent>
              </Select>
            </TableHead>
            <TableHead>Pago</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagos.map(pago => (
            <HookPagosTable key={pago._id} pagoId={pago._id} lote={lote} />
          ))}
          {pagos.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center">No hay pagos registrados</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  )
}
