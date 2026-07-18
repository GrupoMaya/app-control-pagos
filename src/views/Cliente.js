import { useParams } from 'react-router-dom'
import { useClient } from '@/hooks/api/useClients'
import { useLotesByClient } from '@/hooks/api/useLotes'
import { usePagosByProject } from '@/hooks/api/usePagos'
import TablaClienteInfo from '@/Components/TablaClienteInfo'
import { Skeleton } from '@/components/ui/skeleton'

export default function Cliente () {
  const { slug } = useParams()
  const { data: cliente, isLoading: loadingCliente } = useClient(slug)
  const { data: lotes = [], isLoading: loadingLotes } = useLotesByClient(slug)

  // Fetch representative payments for display if we have a lote
  const firstLote = lotes[0]
  const { data: pagos = [], isLoading: loadingPagos } = usePagosByProject({
    idProject: firstLote?.proyecto?.[0],
    clientID: slug,
    loteID: firstLote?._id
  })

  const isLoading = loadingCliente || loadingLotes || loadingPagos

  return (
    <div className="cliente__App__container container mx-auto p-6">
      {isLoading && <Skeleton className="h-64 w-full" />}

      {!isLoading && cliente && (
        <TablaClienteInfo
          cliente={cliente}
          lotes={lotes}
          pagos={pagos}
        />
      )}
    </div>
  )
}
