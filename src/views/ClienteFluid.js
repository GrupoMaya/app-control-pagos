import { useState, useCallback, useMemo } from 'react'
import { useParams, useLocation, Navigate } from 'react-router-dom'
import { usePagosByProject, useDownloadResumenExcel } from '@/hooks/api/usePagos'
import { useAppContext } from '@/context/AppContextProvider'
import PageHeader from '@/components/layout/PageHeader'
import AvatarInitials from '@/components/ui-custom/AvatarInitials'
import SectionTitle from '@/components/ui-custom/SectionTitle'
import NumberFormat from '@/utils/NumberFormat'
import ValuesByDocument from '@/hooks/ValuesByDocument'
import TablaPagosClient from '@/Components/TablaPagosClient'
import ModalPagosClient from '@/Components/ModalPagosClient'
import ModalStatusProjectDetails from '@/Components/ModalStatusProjectDetails'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { CheckCircle2 } from 'lucide-react'

export default function ClienteFluid () {
  const { idlote, clienteSlug, projectSlug } = useParams()
  const location = useLocation()
  const dataQuery = location.state

  const { modalPago, handleModalPago } = useAppContext()
  const [modalPagoDetalles, setModalPagoDetalles] = useState(false)

  const lote = dataQuery?.[0]
  const idProject = lote?.proyecto?.toString() || ''
  const clientID = lote?.cliente?.toString() || ''
  const loteID = lote?._id?.toString() || ''

  const { data: pagos = [], isLoading } = usePagosByProject({
    idProject,
    clientID,
    loteID
  })
  const downloadExcel = useDownloadResumenExcel()

  const downloadResumenExcel = useCallback(() => {
    downloadExcel.mutate({ idProject, clientID })
  }, [downloadExcel, idProject, clientID])

  const resumen = useMemo(() => {
    const totalPagado = pagos.reduce((sum, p) => sum + (p.mensualidad || 0), 0)
    const precio = lote?.precioTotal || 0
    const pct = precio > 0 ? Math.round((totalPagado / precio) * 100) : 0
    return { totalPagado, precio, pct }
  }, [pagos, lote])

  if (!dataQuery) {
    return <Navigate to="/" replace />
  }

  return (
    <>
      <PageHeader title="Detalle de cliente" subtitle="Lotes contratados e historial de pagos" />

      <main className="flex-1 overflow-y-auto p-7">
        <div className="max-w-[1180px] mx-auto animate-fade-up space-y-6">
          <div className="bg-white border border-[#e6ebea] rounded-2xl p-6 flex items-center gap-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
            <AvatarInitials
              name={clienteSlug}
              bg="linear-gradient(145deg, #1EA69A, #50c9c3)"
              color="#fff"
              size="lg"
            />
            <div className="flex-1 min-w-0">
              <h2 className="font-heading font-extrabold text-2xl text-[#1a2621] capitalize">
                {clienteSlug?.replace(/-/g, ' ')}
              </h2>
              <div className="flex gap-4 mt-2 text-[13px] text-[#8a9995] flex-wrap">
                <span>
                  Proyecto: <ValuesByDocument id={projectSlug} documentType="Proyecto" cbValue="title" />
                </span>
                <span>Lote {lote?.lote} · Manzana {lote?.manzana}</span>
              </div>
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
                      <TableRow className="border-b border-[#f1f5f4]">
                        <TableCell className="py-4 px-[18px] text-[13.5px] font-medium text-[#1a2621]">
                          <ValuesByDocument id={projectSlug} documentType="Proyecto" cbValue="title" />
                        </TableCell>
                        <TableCell className="py-4 px-3 text-[13.5px] text-[#5a6b66]">
                          {lote.lote} / {lote.manzana}
                        </TableCell>
                        <TableCell className="py-4 px-3 text-[13.5px] font-semibold text-[#1a2621] text-right">
                          <NumberFormat number={lote.mensualidad} />
                        </TableCell>
                        <TableCell className="py-4 px-3 text-[13.5px] text-[#5a6b66] text-center">
                          {lote.plazo}
                        </TableCell>
                        <TableCell className="py-4 px-[18px] text-[13.5px] font-semibold text-[#1EA69A] text-right">
                          <NumberFormat number={lote.precioTotal} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div>
                <SectionTitle>Historial de pagos</SectionTitle>
                {isLoading && <Skeleton className="h-64 w-full" />}
                {!isLoading && (
                  <TablaPagosClient
                    pagos={pagos}
                    lote={idlote}
                    clienteInfo={{ clienteSlug, proyecto: projectSlug, idlote }}
                    downloadResumenExcel={downloadResumenExcel}
                  />
                )}
              </div>
            </div>

            <div>
              <SectionTitle>Resumen</SectionTitle>
              <div className="bg-white border border-[#e6ebea] rounded-2xl p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#8a9995]">Lotes contratados</span>
                  <span className="font-heading font-extrabold text-lg text-[#1a2621]">1</span>
                </div>
                <div className="h-px bg-[#eef2f1]" />
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#8a9995]">Valor total</span>
                  <span className="font-heading font-extrabold text-lg text-[#1a2621]">
                    <NumberFormat number={resumen.precio} />
                  </span>
                </div>
                <div className="h-px bg-[#eef2f1]" />
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#8a9995]">Pagado</span>
                  <span className="font-heading font-extrabold text-lg text-[#1EA69A]">
                    <NumberFormat number={resumen.totalPagado} />
                  </span>
                </div>
                <div>
                  <div className="h-[9px] bg-[#eef2f1] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#1EA69A] to-[#50c9c3]"
                      style={{ width: `${resumen.pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-[7px] text-[11.5px] text-[#a3afab]">
                    <span>Avance</span>
                    <span className="text-[#5a6b66] font-semibold">{resumen.pct}%</span>
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
        </div>
      </main>

      <ModalPagosClient
        openModalPago={modalPago}
        handledOpen={handleModalPago}
        lotes={dataQuery}
      />

      <ModalStatusProjectDetails
        openModal={modalPagoDetalles}
        handledModal={() => setModalPagoDetalles(!modalPagoDetalles)}
        loteid={pagos}
      />
    </>
  )
}
