import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx'
import { Eye, EyeOff, FileSpreadsheet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
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

export default function TablaMorosos ({ data, title }) {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(true)
  const [projectFilter, setProjectFilter] = useState('all')

  const rows = useMemo(() => {
    const values = Object.values(data || {})
    if (projectFilter === 'all') return values
    return values.filter((pago) => {
      const proyecto = pago.proyecto_data?.[0]
      return proyecto?.title === projectFilter
    })
  }, [data, projectFilter])

  const projects = useMemo(() => {
    const set = new Set()
    Object.values(data || {}).forEach((pago) => {
      const proyecto = pago.proyecto_data?.[0]
      if (proyecto?.title) set.add(proyecto.title)
    })
    return Array.from(set)
  }, [data])

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

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsOpen(prev => !prev)}>
            {isOpen ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <FileSpreadsheet size={18} className="mr-1" />
            Descargar Lista
          </Button>
        </div>
      </div>

      {!isOpen && (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>
                  <Select value={projectFilter} onValueChange={setProjectFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Proyecto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Proyecto</SelectItem>
                      {projects.map((item) => (
                        <SelectItem key={item} value={item}>{item}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableHead>
                <TableHead>Lote</TableHead>
                <TableHead>Inicio de Contrato</TableHead>
                <TableHead>Último Pago</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No hay registros
                  </TableCell>
                </TableRow>
              )}
              {rows.map((pago) => {
                const lote = pago.lote_data?.[0]
                const proyecto = pago.proyecto_data?.[0]
                const cliente = pago.cliente_data?.[0]

                return (
                  <TableRow
                    key={pago?._id}
                    className="cursor-pointer"
                    onClick={() => handledDetail(lote, proyecto?._id, cliente?.nombre)}
                  >
                    <TableCell>{cliente?.nombre}</TableCell>
                    <TableCell>{proyecto?.title}</TableCell>
                    <TableCell>{lote?.lote}</TableCell>
                    <TableCell>
                      {lote?.inicioContrato && (
                        <DateIntlFormat date={lote.inicioContrato} />
                      )}
                    </TableCell>
                    <TableCell>
                      {pago?.mes && <DateIntlFormat date={pago.mes} />}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handledDetail(lote, proyecto?._id, cliente?.nombre)
                        }}
                      >
                        Ver Detalle
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
