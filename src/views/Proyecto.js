import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useProject } from '@/hooks/api/useProjects'
import { useLotesByProject } from '@/hooks/api/useLotes'
import { useUserState } from '@/context/userContext'
import SearchClientProyecto from '@/utils/SearchClientProyecto'
import NumberFormat from '@/utils/NumberFormat'
import DateIntlFormat from '@/utils/DateIntlFormat'
import UpdateModal from '@/Modales/UpdateModal/UpdateModal'
import ModalProyectName from '@/Modales/ModalProyectName'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import * as XLSX from 'xlsx'

export default function Proyecto () {
  const { slug, projectName } = useParams()
  const navigate = useNavigate()
  const { user } = useUserState()
  const isAdmin = user?.role === 'admin'

  const { data: proyecto, isLoading: loadingProject } = useProject(slug)
  const { data: lotesData = [], isLoading: loadingLotes } = useLotesByProject(slug)

  const [currentClientes, setCurrentClientes] = useState([])
  const [editName, setEditName] = useState(false)

  useEffect(() => {
    setCurrentClientes(lotesData)
  }, [lotesData])

  const handleSelectLote = (value) => {
    const keyParse = JSON.parse(value)
    const loteNumber = keyParse.lote
    const [nombreCliente] = keyParse.clienteData.map(item => item.nombre)
    const clientURL = nombreCliente.replace(/\//g, '-')
    const projectObjectID = keyParse.proyecto.toString()

    navigate(`/detalle/lote/${loteNumber}/cliente/${clientURL}/projecto/${projectObjectID}`, {
      state: [keyParse]
    })
  }

  const exportExcel = () => {
    if (!proyecto || proyecto.length === 0) return
    const payloadToExport = proyecto.map(lote => {
      const nombreCliente = lote.clienteData[0]?.nombre
      const { __v, _id, cliente, proyecto: p, isActive, clienteData, ...restOfLote } = lote
      return { cliente: nombreCliente, ...restOfLote }
    })

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(payloadToExport)
    XLSX.utils.book_append_sheet(wb, ws, 'Lotes')
    XLSX.writeFile(wb, `lotes_${projectName}.xlsx`)
  }

  const isLoading = loadingProject || loadingLotes

  return (
    <div className="proyecto__container container mx-auto p-6">
      <section className="proyecto__header mb-6">
        <ModalProyectName
          open={editName}
          handleCloseModal={() => setEditName(false)}
          proyectName={projectName}
          id={slug}
        />

        {isAdmin && (
          <Button variant="link" onClick={() => setEditName(true)}>
            Cambiar nombre de proyecto
          </Button>
        )}

        <div className="proyecto__header__title mb-4">
          <h3 className="text-2xl font-bold">{projectName}</h3>
        </div>

        {!isLoading && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <SearchClientProyecto data={lotesData} setCurrentClientes={setCurrentClientes} />
            <Select onValueChange={handleSelectLote}>
              <SelectTrigger className="w-[260px]">
                <SelectValue placeholder="Todos los lotes" />
              </SelectTrigger>
              <SelectContent>
                {lotesData
                  .slice()
                  .sort((a, b) => +a.lote - +b.lote)
                  .map(item => (
                    <SelectItem key={item._id} value={JSON.stringify(item)}>
                      {`Lote ${item.lote} - Manzana ${item.manzana}`}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </section>

      <section className="proyecto__table">
        <div className="mb-4">
          <Button variant="outline" onClick={exportExcel}>Exportar Lista</Button>
        </div>

        {isLoading && <Skeleton className="h-64 w-full" />}

        {!isLoading && (
          <>
            {currentClientes.length === 0 && (
              <p className="text-xl text-muted-foreground">No se encontraron lotes 😕</p>
            )}

            {currentClientes.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lote</TableHead>
                    <TableHead>Manzana</TableHead>
                    <TableHead>Precio Total</TableHead>
                    <TableHead>Inicio de contrato</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentClientes
                    .filter(item => item.clienteData?.length > 0)
                    .map((item) => {
                      const parentLoteId = item._id
                      const loteid = item.lote
                      const [idProyecto] = item.proyecto
                      return (
                        <TableRow key={item._id} className="tabla__data">
                          <TableCell>{item.lote}</TableCell>
                          <TableCell>{item.manzana}</TableCell>
                          <TableCell><NumberFormat number={item.precioTotal} /></TableCell>
                          <TableCell>
                            {item.inicioContrato && <DateIntlFormat date={item.inicioContrato} />}
                          </TableCell>
                          {item.clienteData.map(cliente => {
                            const clientURL = cliente.nombre.replace(/\//g, '-')
                            return (
                              <>
                                <TableCell key={cliente._id}>{cliente.nombre}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Link
                                      to={`/detalle/lote/${loteid}/cliente/${clientURL}/projecto/${idProyecto}`}
                                      state={[item]}
                                    >
                                      <Button size="sm">Ver</Button>
                                    </Link>
                                    <UpdateModal id={parentLoteId} document="Lote" />
                                  </div>
                                  <small className="text-muted-foreground">{cliente._id}</small>
                                </TableCell>
                              </>
                            )
                          })}
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            )}
          </>
        )}
      </section>
    </div>
  )
}
