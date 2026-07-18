import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

export default function DetallePago ({ visible, onCancel, pdfURL }) {
  return (
    <Dialog open={visible} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Vista Previa</DialogTitle>
        </DialogHeader>
        <div className="flex-1 h-full px-6 pb-6">
          <iframe
            src={pdfURL}
            className="w-full h-full border-0"
            title="Vista previa del recibo"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
