import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx'
import { Eye, EyeOff, FileSpreadsheet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AvatarInitials from '@/components/ui-custom/AvatarInitials'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import DateIntlFormat from '@/utils/DateIntlFormat'

function formatDateMX (date) {
  if (!date) return ''
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(date))
}

function daysSince (date) {
  if (!date) return 0
  const then = new Date(date)
  const now = new Date()
  const diff = now - then
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export default function TablaMorosos ({ data, title, variant = 'orange' }) {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(true)

  const rows = useMemo(() => Object.values(data || {}), [data])

  const handledDetail = (lote, idProject, clienteNombre) => {
    navigate(`/detalle/lote/${lote.lote}/cliente/${clienteNombre}/projecto/${idProject}`, {
      state: [lote]
    })
  }

  const handleDownload = () => {
    const dataRows = rows.map((pago) => {
      const lotes = pago.lote_data?.[0]
      const proyecto = pago.proyecto_data?.[0]
      const cliente = pago.cliente_data?.[0]

      return {
        cliente: cliente?.nombre,
        proyecto: proyecto?.title,
        lote: lotes?.lote,
        inicioContrato: formatDateMX(lotes?.inicioContrato),
        ultimoPago: formatDateMX(pago?.mes)
      }
    })

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(dataRows)
    XLSX.utils.book_append_sheet(wb, ws, 'morosos')
    XLSX.writeFile(wb, 'morosos.xlsx')
  }

  const headerBg = variant === 'red' ? 'bg-[#fdf2f0] border-b border-[#f6dcd7]' : 'bg-[#fff9f0] border-b border-[#f6ecdb]'
  const headerText = variant === 'red' ? 'text-[#c0564a]' : 'text-[#b98a3e]'
  const rowHover = variant === 'red' ? 'hover:bg-[#fdf6f5]' : 'hover:bg-[#fffbf5]'
  const daysColor = variant === 'red' ? 'text-[#d94436] bg-[#fbe3df]' : 'text-[#e08e1a] bg-[#fdf0dc]'
  const actionClass = variant === 'red'
    ? 'bg-[#e74c3c] hover:bg-[#d33] text-white border-0'
    : 'bg-white border border-[#e6ebea] text-[#157a71] hover:bg-[#e9f6f4]'

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: variant === 'red' ? '#e74c3c' : '#f39c12' }}
          />
          <h3 className="font-heading font-bold text-base text-[#1a2621]">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(prev => !prev)}
            className="border-[#e6ebea] text-[#5a6b66] hover:bg-[#f1f5f4] rounded-lg"
          >
            {isOpen ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="border-[#e6ebea] text-[#5a6b66] hover:bg-[#f1f5f4] rounded-lg"
          >
            <FileSpreadsheet size={18} className="mr-1" />
            Descargar Lista
          </Button>
        </div>
      </div>

      {!isOpen && (
        <div className="bg-white border border-[#e6ebea] rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <Table>
            <TableHeader>
              <TableRow className={headerBg}>
                <TableHead className={`text-[11px] uppercase tracking-widest ${headerText} font-semibold py-3 px-5`}>Cliente</TableHead>
                <TableHead className={`text-[11px] uppercase tracking-widest ${headerText} font-semibold py-3 px-4`}>Proyecto / Lote</TableHead>
                <TableHead className={`text-[11px] uppercase tracking-widest ${headerText} font-semibold py-3 px-4`}>Último pago</TableHead>
                <TableHead className={`text-[11px] uppercase tracking-widest ${headerText} font-semibold py-3 px-4 text-center`}>Días</TableHead>
                <TableHead className={`text-[11px] uppercase tracking-widest ${headerText} font-semibold py-3 px-4 text-right`}>Adeudo</TableHead>
                <TableHead className={`text-[11px] uppercase tracking-widest ${headerText} font-semibold py-3 px-5 text-right`}></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-[#8a9995]">
                    No hay registros
                  </TableCell>
                </TableRow>
              )}
              {rows.map((pago) => {
                const lote = pago.lote_data?.[0]
                const proyecto = pago.proyecto_data?.[0]
                const cliente = pago.cliente_data?.[0]
                const dias = daysSince(pago?.mes)

                return (
                  <TableRow
                    key={pago?._id}
                    className={`border-b border-[#f1f5f4] ${rowHover}`}
                  >
                    <TableCell className="py-4 px-5">
                      <div className="flex items-center gap-2.5">
                        <AvatarInitials
                          name={cliente?.nombre}
                          bg={variant === 'red' ? '#fbe3df' : '#fdf0dc'}
                          color={variant === 'red' ? '#c0392b' : '#c67c1e'}
                          size="sm"
                        />
                        <span className="text-[13.5px] font-medium text-[#1a2621]">{cliente?.nombre}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-4 text-[13.5px] text-[#5a6b66]">
                      {proyecto?.title} · Lote {lote?.lote}
                    </TableCell>
                    <TableCell className="py-4 px-4 text-[13.5px] text-[#5a6b66]">
                      {pago?.mes && <DateIntlFormat date={pago.mes} />}
                    </TableCell>
                    <TableCell className="py-4 px-4 text-center">
                      <span className={`text-[12.5px] font-bold px-2.5 py-[3px] rounded-full ${daysColor}`}>
                        {dias} días
                      </span>
                    </TableCell>
                    <TableCell className="py-4 px-4 text-[13.5px] font-semibold text-[#1a2621] text-right">
                      $—
                    </TableCell>
                    <TableCell className="py-4 px-5 text-right">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handledDetail(lote, proyecto?._id, cliente?.nombre)
                        }}
                        className={`rounded-lg px-3 py-1.5 text-[12.5px] font-semibold ${actionClass}`}
                      >
                        Ver pagos
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
