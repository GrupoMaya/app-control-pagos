import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function ErrorModal ({ message, open, handleCloseModal }) {
  return (
    <Dialog open={open} onOpenChange={handleCloseModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Error</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-red-500 whitespace-pre-wrap">{message}</p>
        <div className="flex justify-end">
          <Button onClick={() => handleCloseModal(false)}>Cerrar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
