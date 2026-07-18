import { useState } from 'react'
import ValuesByDocument from '@/hooks/ValuesByDocument'
import NumberFormat from '@/utils/NumberFormat'
import ModalStatusProjectDetails from './ModalStatusProjectDetails'
import AvatarInitials from '@/components/ui-custom/AvatarInitials'
import SectionTitle from '@/components/ui-custom/SectionTitle'
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Mail, Phone, CheckCircle2 } from 'lucide-react'

export default function TablaClienteInfo ({ cliente, lotes }) {
  const [expediente, setExpediente] = useState(false)
  const [projectStatus, setProjectStatus] = useState(false)
  const [loteId, setLoteId] = useState(null)

  const handledProjectStatus = (selectedLoteId) => {
    setLoteId(selectedLoteId)
    setProjectStatus(!projectStatus)
  }

  return (
    <>
      <ModalStatusProjectDetails
        openModal={projectStatus}
        handledModal={() => setProjectStatus(!projectStatus)}
        loteid={loteId ? [loteId] : []}
      />

      <Dialog open={expediente} onOpenChange={setExpediente}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading font-bold">Expediente del Cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4 text-sm">
            <section>
              <p className="text-[#8a9995] text-xs uppercase tracking-wider">Nombre</p>
              {cliente?.nombre}
            </section>
            <section>
              <p className="text-[#8a9995] text-xs uppercase tracking-wider">Dirección</p>
              {cliente?.address}
            </section>
            <section>
              <p className="text-[#8a9995] text-xs uppercase tracking-wider">Teléfono</p>
              {cliente?.phone}
            </section>
            <section>
              <p className="text-[#8a9995] text-xs uppercase tracking-wider">Email</p>
              {cliente?.email}
            </section>
          </div>
        </DialogContent>
      </Dialog>

      <div className="bg-white border border-[#e6ebea] rounded-2xl p-6 flex items-center gap-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] mb-6">
        <AvatarInitials
          name={cliente?.nombre}
          bg="linear-gradient(145deg, #1EA69A, #50c9c3)"
          color="#fff"
          size="lg"
        />
        <div className="flex-1 min-w-0">
          <h2 className="font-heading font-extrabold text-2xl text-[#1a2621]">{cliente?.nombre}</h2>
          <div className="flex gap-4 mt-2 text-[13px] text-[#8a9995] flex-wrap">
            {cliente?.email && (
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                {cliente.email}
              </span>
            )}
            {cliente?.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                {cliente.phone}
              </span>
            )}
          </div>
        </div>
        <Button
          onClick={() => setExpediente(true)}
          className="bg-[#1EA69A] hover:bg-[#178f85] text-white rounded-[10px] px-4 py-2.5 text-[13.5px] font-medium shadow-[0_4px_10px_rgba(30,166,154,0.25)]"
        >
          Ver Expediente
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-[22px]">
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
                {lotes.map((lote) => {
                  const [idProject] = lote.proyecto || []
                  return (
                    <TableRow
                      key={lote._id}
                      className="border-b border-[#f1f5f4] cursor-pointer hover:bg-[#f9fbfb]"
                      onClick={() => handledProjectStatus(lote)}
                    >
                      <TableCell className="py-4 px-[18px] text-[13.5px] font-medium text-[#1a2621]">
                        <ValuesByDocument id={idProject} documentType="Proyecto" cbValue="title" />
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
                  )
                })}
                {lotes.length === 0 && (
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

        <div>
          <SectionTitle>Resumen</SectionTitle>
          <div className="bg-white border border-[#e6ebea] rounded-2xl p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#8a9995]">Lotes contratados</span>
              <span className="font-heading font-extrabold text-lg text-[#1a2621]">{lotes.length}</span>
            </div>
            <div className="h-px bg-[#eef2f1]" />
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#8a9995]">Valor total</span>
              <span className="font-heading font-extrabold text-lg text-[#1a2621]">
                <NumberFormat number={lotes.reduce((s, l) => s + (l.precioTotal || 0), 0)} />
              </span>
            </div>
            <div className="h-px bg-[#eef2f1]" />
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#8a9995]">Pagado</span>
              <span className="font-heading font-extrabold text-lg text-[#1EA69A]">$—</span>
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
    </>
  )
}
