import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import HookPagosModalInvoce from '@/hooks/HookPagosModalInvoce'

export default function ModalPagosClient ({ openModalPago, handledOpen, lotes }) {
  return (
    <Dialog open={openModalPago} onOpenChange={handledOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Agregar Pago</DialogTitle>
        </DialogHeader>
        <HookPagosModalInvoce lote={lotes[0]} onClose={() => handledOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
