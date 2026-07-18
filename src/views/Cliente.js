import { useParams } from 'react-router-dom'
import { useClient } from '@/hooks/api/useClients'
import { useLotesByClient } from '@/hooks/api/useLotes'
import { usePagosByProject } from '@/hooks/api/usePagos'
import PageHeader from '@/components/layout/PageHeader'
import TablaClienteInfo from '@/Components/TablaClienteInfo'
import { Skeleton } from '@/components/ui/skeleton'

export default function Cliente () {
  const { slug } = useParams()
  const { data: cliente, isLoading: loadingCliente } = useClient(slug)
  const { data: lotes = [], isLoading: loadingLotes } = useLotesByClient(slug)

  const firstLote = lotes[0]
  const { data: pagos = [], isLoading: loadingPagos } = usePagosByProject({
    idProject: firstLote?.proyecto?.[0],
    clientID: slug,
    loteID: firstLote?._id
  })

  const isLoading = loadingCliente || loadingLotes || loadingPagos

  return (
    <>
      <PageHeader title="Detalle de cliente" subtitle="Lotes contratados e historial de pagos" />
      <main className="flex-1 overflow-y-auto p-7">
        <div className="max-w-[1180px] mx-auto animate-fade-up">
          {isLoading && <Skeleton className="h-64 w-full" />}

          {!isLoading && cliente && (
            <TablaClienteInfo
              cliente={cliente}
              lotes={lotes}
              pagos={pagos}
            />
          )}
        </div>
      </main>
    </>
  )
}
