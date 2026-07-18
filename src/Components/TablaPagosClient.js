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
    <section className="bg-white border border-[#e6ebea] rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={exportExcel}
            className="border-[#e6ebea] text-[#5a6b66] hover:bg-[#f1f5f4] rounded-lg text-[13px]"
          >
            🗒️ Exportar Lista de pagos
          </Button>
          <Button
            variant="outline"
            onClick={downloadResumenExcel}
            className="border-[#e6ebea] text-[#5a6b66] hover:bg-[#f1f5f4] rounded-lg text-[13px]"
          >
            💾 ESTADO DE CUENTA
          </Button>
        </div>

        <Select value={pagosSelected} onValueChange={setPagosSelected}>
          <SelectTrigger className="w-[140px] border-[#e6ebea] rounded-lg text-[13px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="mensualidad">Mensualidad</SelectItem>
            <SelectItem value="extra">Extra</SelectItem>
            <SelectItem value="saldoinicial">Saldo Inicial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ModalEstatus openModal={modalPago} handledStatusPago={setModalPago} />

      <Table>
        <TableHeader>
          <TableRow className="bg-[#f7faf9] border-b border-[#eef2f1] hover:bg-[#f7faf9]">
            <TableHead className="text-[11px] uppercase tracking-widest text-[#8a9995] font-semibold py-3 px-[18px]">Folio</TableHead>
            <TableHead className="text-[11px] uppercase tracking-widest text-[#8a9995] font-semibold py-3 px-3">Fecha</TableHead>
            <TableHead className="text-[11px] uppercase tracking-widest text-[#8a9995] font-semibold py-3 px-3">Estatus</TableHead>
            <TableHead className="text-[11px] uppercase tracking-widest text-[#8a9995] font-semibold py-3 px-3">Referencia</TableHead>
            <TableHead className="text-[11px] uppercase tracking-widest text-[#8a9995] font-semibold py-3 px-3">
              <Select value={pagosSelected} onValueChange={setPagosSelected}>
                <SelectTrigger className="w-[120px] border-0 bg-transparent p-0 h-auto text-[11px] uppercase tracking-widest text-[#8a9995] font-semibold focus:ring-0">
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
            <TableHead className="text-[11px] uppercase tracking-widest text-[#8a9995] font-semibold py-3 px-3 text-right">Pago</TableHead>
            <TableHead className="text-[11px] uppercase tracking-widest text-[#8a9995] font-semibold py-3 px-[18px] text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagos.map(pago => (
            <HookPagosTable key={pago._id} pagoId={pago._id} lote={lote} />
          ))}
          {pagos.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-[#8a9995]">
                No hay pagos registrados
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  )
}
