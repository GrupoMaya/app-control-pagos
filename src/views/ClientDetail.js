import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useClientDetail } from '@/hooks/api/useClients'
import { useUserState } from '@/context/userContext'
import NumberFormat from '@/utils/NumberFormat'
import DateIntlFormat from '@/utils/DateIntlFormat'
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
import { Pencil } from 'lucide-react'

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

  return (
    <div className="container mx-auto p-6">
      {isLoading && <Skeleton className="h-64 w-full" />}

      {!isLoading && cliente && (
        <>
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold">{cliente.nombre}</h1>
              {isAdmin && (
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
                  <Pencil className="w-5 h-5" />
                </Button>
              )}
            </div>
            <p className="text-muted-foreground">Selecciona alguno de los lotes para ver sus detalles</p>
            <small>ID interno: {cliente.email}</small>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proyecto</TableHead>
                <TableHead>Lote</TableHead>
                <TableHead>Manzana</TableHead>
                <TableHead>Inicio de Contrato</TableHead>
                <TableHead>Mensualidad</TableHead>
                <TableHead>Plazo</TableHead>
                <TableHead>Precio Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cliente.lotes?.map(lote => {
                const [idProject] = lote?.proyecto || []
                return (
                  <TableRow
                    key={lote?._id}
                    className="cursor-pointer"
                    onClick={() => handleDetail(lote, idProject)}
                  >
                    <TableCell>
                      <ValuesByDocument id={idProject} documentType="Proyecto" cbValue="title" />
                    </TableCell>
                    <TableCell>{lote?.lote}</TableCell>
                    <TableCell>{lote?.manzana}</TableCell>
                    <TableCell>
                      {lote?.inicioContrato && <DateIntlFormat date={lote?.inicioContrato} />}
                    </TableCell>
                    <TableCell><NumberFormat number={lote?.mensualidad} /></TableCell>
                    <TableCell>{lote?.plazo}</TableCell>
                    <TableCell><NumberFormat number={lote?.precioTotal} /></TableCell>
                  </TableRow>
                )
              })}
              {cliente.lotes?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">No hay lotes registrados</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="mt-6">
            {isAdmin && (
              <Button onClick={() => setNewLote(true)}>Añadir Lote</Button>
            )}
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
  )
}
