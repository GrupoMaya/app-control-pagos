import { useState, useCallback } from 'react'
import { useAppContext } from '@/context/AppContextProvider'
import { usePagoInfo, useGeneratePdf } from '@/hooks/api/usePagos'
import { useUserState } from '@/context/userContext'
import NumberFormat from '@/utils/NumberFormat'
import DateIntlFormat from '@/utils/DateIntlFormat'
import DetallePago from '@/Models/DetallePago'
import UpdateModal from '@/Modales/UpdateModal/UpdateModal'
import { TableCell, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { saveAs } from 'file-saver'

export default function HookPagosTable ({ pagoId, lote }) {
  const { data: pagoList = [], isLoading } = usePagoInfo(pagoId)
  const { setModalPago, setIdPago } = useAppContext()
  const { user } = useUserState()
  const isAdmin = user?.role === 'admin'
  const generatePdf = useGeneratePdf()

  const [openDetalle, setOpenDetalle] = useState(false)
  const [pdfPreview, setPdfPreview] = useState(null)

  const handledDetalle = () => setOpenDetalle(!openDetalle)

  const handlePagador = (id) => {
    setModalPago(true)
    setIdPago(id)
  }

  const downloadPdf = useCallback(async (data) => {
    const blob = await generatePdf.mutateAsync({ folio: data._id, data })
    saveAs(blob, `${data.dataClient[0].nombre}_Folio_${data.folio}.pdf`)
  }, [generatePdf])

  const previewURL = useCallback(async (data) => {
    const blob = await generatePdf.mutateAsync({ folio: data._id, data })
    const URLpreview = URL.createObjectURL(blob)
    setPdfPreview(URLpreview)
    handledDetalle()
  }, [generatePdf])

  if (isLoading) return null

  return (
    <>
      {pagoList
        .filter(pago => pago.dataLote[0]?.lote === lote)
        .map(pago => {
          let variant = 'default'
          switch (pago.tipoPago) {
            case 'extra':
              variant = 'secondary'
              break
            case 'acreditado':
              variant = 'outline'
              break
            case 'saldoinicial':
              variant = 'destructive'
              break
            default:
              variant = 'default'
          }

          return (
            <TableRow key={pago._id} id="row_info_pago" className="tabla__data">
              <TableCell>{pago.folio}</TableCell>
              <TableCell><DateIntlFormat date={pago.mes} type="numeric" /></TableCell>
              <TableCell className={pago.status ? 'text-green-600' : 'text-yellow-600'}>
                {pago.status ? 'Pagado' : 'Pendiente'}
              </TableCell>
              <TableCell>{pago.refPago}</TableCell>
              <TableCell>
                <Badge variant={variant}>{pago.tipoPago}</Badge>
              </TableCell>
              <TableCell>
                <NumberFormat number={pago.mensualidad?.$numberDecimal || pago.mensualidad} />
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {isAdmin && (
                    <Button size="sm" disabled={pago.status} onClick={() => handlePagador(pago._id)}>
                      PAGAR
                    </Button>
                  )}
                  <Button size="sm" variant="outline" disabled={!pago.status} onClick={() => previewURL(pago)}>
                    Vista previa
                  </Button>
                  <Button
                    size="sm"
                    style={{ backgroundColor: '#0C4C7D' }}
                    disabled={!pago.status}
                    onClick={() => downloadPdf(pago)}
                  >
                    Descargar
                  </Button>
                  <UpdateModal id={pago._id} document="Pago" />
                </div>
                <small className="text-muted-foreground">{pago._id}</small>
              </TableCell>
            </TableRow>
          )
        })}

      <DetallePago
        visible={openDetalle}
        onCancel={handledDetalle}
        pdfURL={pdfPreview}
      />
    </>
  )
}
