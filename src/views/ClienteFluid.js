import { useState, useCallback } from 'react'
import { useParams, useLocation, Navigate } from 'react-router-dom'
import { usePagosByProject, useDownloadResumenExcel } from '@/hooks/api/usePagos'
import { useAppContext } from '@/context/AppContextProvider'
import NumberFormat from '@/utils/NumberFormat'
import DateIntlFormat from '@/utils/DateIntlFormat'
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

  if (!dataQuery) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="cliente__App__container container mx-auto p-6">
      <section className="cliente__App__header mb-4">
        <h4 className="text-xl font-bold">
          {clienteSlug}
          <hr className="my-2" />
          <ValuesByDocument id={projectSlug} documentType="Proyecto" cbValue="title" />
        </h4>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Información del lote</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Proyecto</TableHead>
              <TableHead>Lote</TableHead>
              <TableHead>Manzana</TableHead>
              <TableHead>Inicio Contrato</TableHead>
              <TableHead>Plazo</TableHead>
              <TableHead>Mensualidad</TableHead>
              <TableHead>Enganche</TableHead>
              <TableHead>Financiamiento</TableHead>
              <TableHead>Precio Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <ValuesByDocument id={projectSlug} documentType="Proyecto" cbValue="title" />
              </TableCell>
              <TableCell>{lote.lote}</TableCell>
              <TableCell>{lote.manzana}</TableCell>
              <TableCell>
                {lote.inicioContrato && <DateIntlFormat date={lote.inicioContrato} />}
              </TableCell>
              <TableCell>{lote.plazo}</TableCell>
              <TableCell><NumberFormat number={lote.mensualidad} /></TableCell>
              <TableCell><NumberFormat number={lote.enganche} /></TableCell>
              <TableCell><NumberFormat number={lote.financiamiento} /></TableCell>
              <TableCell><NumberFormat number={lote.precioTotal} /></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      <section>
        {isLoading && <Skeleton className="h-64 w-full" />}

        {!isLoading && (
          <TablaPagosClient
            pagos={pagos}
            lote={idlote}
            clienteInfo={{ clienteSlug, proyecto: projectSlug, idlote }}
            downloadResumenExcel={downloadResumenExcel}
          />
        )}
      </section>

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
    </div>
  )
}
