import { useEffect, useState, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useProject } from '@/hooks/api/useProjects'
import { useLotesByProject } from '@/hooks/api/useLotes'
import { useUserState } from '@/context/userContext'
import PageHeader from '@/components/layout/PageHeader'
import StatusBadge from '@/components/ui-custom/StatusBadge'
import AvatarInitials from '@/components/ui-custom/AvatarInitials'
import SearchInput from '@/components/ui-custom/SearchInput'
import UpdateModal from '@/Modales/UpdateModal/UpdateModal'
import ModalProyectName from '@/Modales/ModalProyectName'
import NumberFormat from '@/utils/NumberFormat'
import DateIntlFormat from '@/utils/DateIntlFormat'
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
import { Skeleton } from '@/components/ui/skeleton'
import { Pencil, Download } from 'lucide-react'
import * as XLSX from 'xlsx'

export default function Proyecto () {
  const { slug, projectName } = useParams()
  const { user } = useUserState()
  const isAdmin = user?.role === 'admin'

  const { data: proyecto, isLoading: loadingProject } = useProject(slug)
  const { data: lotesData = [], isLoading: loadingLotes } = useLotesByProject(slug)

  const [currentClientes, setCurrentClientes] = useState([])
  const [editName, setEditName] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    setCurrentClientes(lotesData)
  }, [lotesData])

  const filteredClientes = useMemo(() => {
    let rows = currentClientes
    if (search.trim()) {
      const regex = new RegExp(search.trim(), 'gi')
      rows = rows.filter(item => item.clienteData?.[0]?.nombre?.match(regex))
    }
    if (statusFilter !== 'all') {
      // Placeholder: real status filter requires payment state per lote
      rows = rows.filter(() => statusFilter === 'corriente')
    }
    return rows
  }, [currentClientes, search, statusFilter])

  const exportExcel = () => {
    if (!proyecto || proyecto.length === 0) return
    const payloadToExport = proyecto.map(lote => {
      const nombreCliente = lote.clienteData?.[0]?.nombre
      const { __v, _id, cliente: _cliente, proyecto: _proyecto, isActive: _isActive, clienteData: _clienteData, ...restOfLote } = lote
      return { cliente: nombreCliente, ...restOfLote }
    })

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(payloadToExport)
    XLSX.utils.book_append_sheet(wb, ws, 'Lotes')
    XLSX.writeFile(wb, `lotes_${projectName}.xlsx`)
  }

  const isLoading = loadingProject || loadingLotes

  return (
    <>
      <PageHeader title={projectName} subtitle="Detalle de lotes del proyecto" />

      <main className="flex-1 overflow-y-auto p-7">
        <div className="max-w-[1180px] mx-auto animate-fade-up space-y-5">
          <ModalProyectName
            open={editName}
            handleCloseModal={() => setEditName(false)}
            proyectName={projectName}
            id={slug}
          />

          <div className="rounded-[18px] overflow-hidden bg-gradient-to-br from-[#178f85] to-[#50c9c3] px-7 py-6 flex items-center justify-between shadow-[0_8px_22px_rgba(30,166,154,0.22)]"
          >
            <div>
              <div className="text-[12.5px] text-white/80 tracking-widest mb-1.5">PROYECTO</div>
              <h2 className="font-heading font-extrabold text-[30px] text-white uppercase tracking-wide">
                {projectName}
              </h2>
              <div className="flex gap-6 mt-3.5">
                <div>
                  <span className="font-heading font-extrabold text-[19px] text-white">
                    {currentClientes.length}
                  </span>
                  <span className="text-[12.5px] text-white/80 ml-1.5">lotes</span>
                </div>
                <div>
                  <span className="font-heading font-extrabold text-[19px] text-white">$—</span>
                  <span className="text-[12.5px] text-white/80 ml-1.5">cobrado</span>
                </div>
                <div>
                  <span className="font-heading font-extrabold text-[19px] text-white">—</span>
                  <span className="text-[12.5px] text-white/80 ml-1.5">atrasados</span>
                </div>
              </div>
            </div>

            {isAdmin && (
              <Button
                onClick={() => setEditName(true)}
                variant="outline"
                className="bg-white/16 border-white/35 text-white hover:bg-white/26 hover:text-white rounded-[10px] px-3.5 py-2 text-[13px] font-medium flex items-center gap-2"
              >
                <Pencil className="w-[15px] h-[15px]" />
                Cambiar nombre
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <SearchInput
              placeholder="Buscar por cliente, lote o manzana..."
              value={search}
              onChange={setSearch}
              className="flex-1 min-w-[240px]"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-white border-[#e6ebea] rounded-[10px] text-[13.5px] text-[#5a6b66]">
                <SelectValue placeholder="Todos los lotes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los lotes</SelectItem>
                <SelectItem value="corriente">Al corriente</SelectItem>
                <SelectItem value="atrasado">Atrasados</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={exportExcel}
              className="bg-white border-[#e6ebea] text-[#157a71] hover:bg-[#e9f6f4] hover:border-[#bfe6e1] rounded-[10px] px-4 py-2.5 text-[13.5px] font-semibold flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar
            </Button>
          </div>

          <div className="bg-white border border-[#e6ebea] rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
            {isLoading && <Skeleton className="h-64 w-full" />}

            {!isLoading && (
              <>
                {filteredClientes.length === 0 && (
                  <p className="p-8 text-center text-[#8a9995]">No se encontraron lotes 😕</p>
                )}

                {filteredClientes.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#f7faf9] border-b border-[#eef2f1] hover:bg-[#f7faf9]">
                        <TableHead className="text-[11.5px] uppercase tracking-widest text-[#8a9995] font-semibold py-3 px-5">Lote</TableHead>
                        <TableHead className="text-[11.5px] uppercase tracking-widest text-[#8a9995] font-semibold py-3 px-4">Manzana</TableHead>
                        <TableHead className="text-[11.5px] uppercase tracking-widest text-[#8a9995] font-semibold py-3 px-4">Precio total</TableHead>
                        <TableHead className="text-[11.5px] uppercase tracking-widest text-[#8a9995] font-semibold py-3 px-4">Inicio contrato</TableHead>
                        <TableHead className="text-[11.5px] uppercase tracking-widest text-[#8a9995] font-semibold py-3 px-4">Cliente</TableHead>
                        <TableHead className="text-[11.5px] uppercase tracking-widest text-[#8a9995] font-semibold py-3 px-4">Estatus</TableHead>
                        <TableHead className="text-[11.5px] uppercase tracking-widest text-[#8a9995] font-semibold py-3 px-5 text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClientes
                        .filter(item => item.clienteData?.length > 0)
                        .map((item) => {
                          const parentLoteId = item._id
                          const loteid = item.lote
                          const [idProyecto] = item.proyecto
                          return item.clienteData.map(cliente => {
                            const clientURL = cliente.nombre.replace(/\//g, '-')
                            return (
                              <TableRow
                                key={`${item._id}-${cliente._id}`}
                                className="border-b border-[#f1f5f4] hover:bg-[#f9fbfb]"
                              >
                                <TableCell className="py-4 px-5">
                                  <span className="font-heading font-extrabold text-[15px] text-[#1a2621]">
                                    {item.lote}
                                  </span>
                                </TableCell>
                                <TableCell className="py-4 px-4 text-[13.5px] text-[#5a6b66]">{item.manzana}</TableCell>
                                <TableCell className="py-4 px-4 text-[13.5px] font-semibold text-[#1a2621]">
                                  <NumberFormat number={item.precioTotal} />
                                </TableCell>
                                <TableCell className="py-4 px-4 text-[13.5px] text-[#5a6b66]">
                                  {item.inicioContrato && <DateIntlFormat date={item.inicioContrato} />}
                                </TableCell>
                                <TableCell className="py-4 px-4">
                                  <div className="flex items-center gap-2.5">
                                    <AvatarInitials
                                      name={cliente.nombre}
                                      bg="#e3f2f0"
                                      color="#157a71"
                                      size="sm"
                                    />
                                    <span className="text-[13.5px] text-[#1a2621] font-medium">{cliente.nombre}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="py-4 px-4">
                                  <StatusBadge status="Al corriente" />
                                </TableCell>
                                <TableCell className="py-4 px-5 text-right">
                                  <div className="inline-flex gap-2">
                                    <Link
                                      to={`/detalle/lote/${loteid}/cliente/${clientURL}/projecto/${idProyecto}`}
                                      state={[item]}
                                    >
                                      <Button size="sm" className="bg-[#1EA69A] hover:bg-[#178f85] text-white rounded-lg px-3.5 py-1.5 text-xs font-semibold">
                                        Ver
                                      </Button>
                                    </Link>
                                    <UpdateModal id={parentLoteId} document="Lote" />
                                  </div>
                                  <small className="text-[11px] text-[#a3afab]">{cliente._id}</small>
                                </TableCell>
                              </TableRow>
                            )
                          })
                        })}
                    </TableBody>
                  </Table>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
