import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useClientDetail } from '@/hooks/api/useClients'
import { useUserState } from '@/context/userContext'
import PageHeader from '@/components/layout/PageHeader'
import AvatarInitials from '@/components/ui-custom/AvatarInitials'
import SectionTitle from '@/components/ui-custom/SectionTitle'
import NumberFormat from '@/utils/NumberFormat'
import ValuesByDocument from '@/hooks/ValuesByDocument'
import DrawerAddLote from '@/Components/DrawerAddLote'
import DrawUpdateCiente from '@/Modales/DrawUpdateCiente'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Pencil, Mail, Phone, Plus, CheckCircle2 } from 'lucide-react'

export default function ClientDetail () {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useUserState()
  const isAdmin = user?.role === 'admin'

  const { data: cliente, isLoading } = useClientDetail(id)

  const [isOpen, setIsOpen] = useState(false)
  const [newLote, setNewLote] = useState(false)

  const handleDetail = (lote, idProject) => {
    navigate(`/detalle/lote/${lote.lote}/cliente/${cliente.nombre}/projecto/${idProject}`, {
      state: [lote]
    })
  }

  const resumen = useMemo(() => {
    const lotes = cliente?.lotes || []
    const total = lotes.reduce((sum, l) => sum + (l.precioTotal || 0), 0)
    return { count: lotes.length, total }
  }, [cliente])

  return (
    <>
      <PageHeader title="Detalle de cliente" subtitle="Lotes contratados e historial de pagos" />

      <main className="flex-1 overflow-y-auto p-7">
        <div className="max-w-[1180px] mx-auto animate-fade-up space-y-6">
          {isLoading && <Skeleton className="h-64 w-full" />}

          {!isLoading && cliente && (
            <>
              <div className="bg-white border border-[#e6ebea] rounded-2xl p-6 flex items-center gap-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                <AvatarInitials
                  name={cliente.nombre}
                  bg="linear-gradient(145deg, #1EA69A, #50c9c3)"
                  color="#fff"
                  size="lg"
                />

                <div className="flex-1 min-w-0">
                  <h2 className="font-heading font-extrabold text-2xl text-[#1a2621]">
                    {cliente.nombre}
                  </h2>
                  <div className="flex gap-4 mt-2 text-[13px] text-[#8a9995] flex-wrap">
                    {cliente.email && (
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        {cliente.email}
                      </span>
                    )}
                    {cliente.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" />
                        {cliente.phone}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2.5">
                  {isAdmin && (
                    <Button
                      variant="outline"
                      onClick={() => setIsOpen(true)}
                      className="border-[#e6ebea] text-[#5a6b66] hover:bg-[#f1f5f4] rounded-[10px] px-4 py-2.5 text-[13.5px] font-medium flex items-center gap-2"
                    >
                      <Pencil className="w-[15px] h-[15px]" />
                      Editar
                    </Button>
                  )}
                  {isAdmin && (
                    <Button
                      onClick={() => setNewLote(true)}
                      className="bg-[#1EA69A] hover:bg-[#178f85] text-white rounded-[10px] px-4 py-2.5 text-[13.5px] font-medium shadow-[0_4px_10px_rgba(30,166,154,0.25)] flex items-center gap-2"
                    >
                      <Plus className="w-[15px] h-[15px]" strokeWidth={2.3} />
                      Añadir Lote
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-[22px]">
                <div className="space-y-6">
                  <div>
                    <SectionTitle>Lotes del cliente</SectionTitle>
                    <div className="bg-white border border-[#e6ebea] rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-[#f7faf9] border-b border-[#eef2f1] hover:bg-[#f7faf9]">
                            <TableHead className="text-[11px] uppercase tracking-widest text-[#8a9995] font-semibold py-3 px-[18px]">Proyecto</TableHead>
                            <TableHead className="text-[11px] uppercase tracking-widest text-[#8a9995] font-semibold py-3 px-3">Lote / Mz</TableHead>
                            <TableHead className="text-[11px] uppercase tracking-widest text-[#8a9995] font-semibold py-3 px-3 text-right">Mensualidad</TableHead>
                            <TableHead className="text-[11px] uppercase tracking-widest text-[#8a9995] font-semibold py-3 px-3 text-center">Plazo</TableHead>
                            <TableHead className="text-[11px] uppercase tracking-widest text-[#8a9995] font-semibold py-3 px-[18px] text-right">Precio total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {cliente.lotes?.map((lote) => {
                            const [idProject] = lote?.proyecto || []
                            return (
                              <TableRow
                                key={lote?._id}
                                className="border-b border-[#f1f5f4] cursor-pointer hover:bg-[#f9fbfb]"
                                onClick={() => handleDetail(lote, idProject)}
                              >
                                <TableCell className="py-4 px-[18px] text-[13.5px] font-medium text-[#1a2621]">
                                  <ValuesByDocument id={idProject} documentType="Proyecto" cbValue="title" />
                                </TableCell>
                                <TableCell className="py-4 px-3 text-[13.5px] text-[#5a6b66]">
                                  {lote?.lote} / {lote?.manzana}
                                </TableCell>
                                <TableCell className="py-4 px-3 text-[13.5px] font-semibold text-[#1a2621] text-right">
                                  <NumberFormat number={lote?.mensualidad} />
                                </TableCell>
                                <TableCell className="py-4 px-3 text-[13.5px] text-[#5a6b66] text-center">
                                  {lote?.plazo}
                                </TableCell>
                                <TableCell className="py-4 px-[18px] text-[13.5px] font-semibold text-[#1EA69A] text-right">
                                  <NumberFormat number={lote?.precioTotal} />
                                </TableCell>
                              </TableRow>
                            )
                          })}
                          {cliente.lotes?.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-6 text-[#8a9995]">
                                No hay lotes registrados
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>

                <div>
                  <SectionTitle>Resumen</SectionTitle>
                  <div className="bg-white border border-[#e6ebea] rounded-2xl p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] text-[#8a9995]">Lotes contratados</span>
                      <span className="font-heading font-extrabold text-lg text-[#1a2621]">{resumen.count}</span>
                    </div>
                    <div className="h-px bg-[#eef2f1]" />
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] text-[#8a9995]">Valor total</span>
                      <span className="font-heading font-extrabold text-lg text-[#1a2621]">
                        <NumberFormat number={resumen.total} />
                      </span>
                    </div>
                    <div className="h-px bg-[#eef2f1]" />
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] text-[#8a9995]">Pagado</span>
                      <span className="font-heading font-extrabold text-lg text-[#1EA69A]">$—</span>
                    </div>
                    <div>
                      <div className="h-[9px] bg-[#eef2f1] rounded-full overflow-hidden">
                        <div className="h-full w-[37%] rounded-full bg-gradient-to-r from-[#1EA69A] to-[#50c9c3]" />
                      </div>
                      <div className="flex justify-between mt-[7px] text-[11.5px] text-[#a3afab]">
                        <span>Avance</span>
                        <span className="text-[#5a6b66] font-semibold">37%</span>
                      </div>
                    </div>

                    <div className="bg-[#e9f6f4] border border-[#bfe6e1] rounded-xl p-3.5 flex items-center gap-2.5">
                      <CheckCircle2 className="w-[18px] h-[18px] text-[#157a71]" />
                      <div>
                        <div className="text-[13px] font-semibold text-[#157a71]">Al corriente</div>
                        <div className="text-[11.5px] text-[#5a8f88]">Último pago registrado</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <DrawerAddLote
                dataClient={cliente}
                isOpen={newLote}
                setIsOpen={setNewLote}
              />

              <DrawUpdateCiente
                send={() => {}}
                dataClient={cliente}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
              />
            </>
          )}
        </div>
      </main>
    </>
  )
}
