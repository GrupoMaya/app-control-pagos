import { useState } from 'react'
import { Link } from 'react-router-dom'
import ValuesByDocument from '@/hooks/ValuesByDocument'
import NumberFormat from '@/utils/NumberFormat'
import ModalStatusProjectDetails from './ModalStatusProjectDetails'
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

export default function TablaClienteInfo ({ cliente, lotes, pagos }) {
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Expediente del Cliente</DialogTitle>
          </DialogHeader>
          <div className="expediente__data space-y-2 py-4">
            <section><p>Nombre:</p>{cliente?.nombre}</section>
            <section><p>DIRECCIÓN</p>{cliente?.address}</section>
            <section><p>Teléfono</p>{cliente?.phone}</section>
            <section><p>Email</p>{cliente?.email}</section>
          </div>
        </DialogContent>
      </Dialog>

      <section className="cliente__App__header mb-4">
        <h4 className="text-2xl font-bold">{cliente?.nombre}</h4>
      </section>

      <section className="cliente__App__body space-y-6">
        <Button onClick={() => setExpediente(true)}>Ver Expediente</Button>

        <div>
          <h3 className="text-lg font-semibold mb-2">Proyectos</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proyecto</TableHead>
                <TableHead>Lote</TableHead>
                <TableHead>Manzana</TableHead>
                <TableHead>Plazo</TableHead>
                <TableHead>Mensualidad</TableHead>
                <TableHead>Enganche</TableHead>
                <TableHead>Financiamiento</TableHead>
                <TableHead>Precio Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lotes.map((lote) => {
                const [idProyecto] = lote.proyecto || []
                return (
                  <TableRow
                    key={lote._id}
                    className="tabla__data cursor-pointer"
                    onClick={() => handledProjectStatus(lote)}
                  >
                    <TableCell>
                      <ValuesByDocument id={idProyecto} documentType="Proyecto" cbValue="title" />
                    </TableCell>
                    <TableCell>{lote.lote}</TableCell>
                    <TableCell>{lote.manzana}</TableCell>
                    <TableCell>{lote.plazo}</TableCell>
                    <TableCell><NumberFormat number={lote.mensualidad} /></TableCell>
                    <TableCell><NumberFormat number={lote.enganche} /></TableCell>
                    <TableCell><NumberFormat number={lote.financiamiento} /></TableCell>
                    <TableCell><NumberFormat number={lote.precioTotal} /></TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </section>
    </>
  )
}
