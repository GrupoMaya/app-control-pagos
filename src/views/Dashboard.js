import { useProjects } from '@/hooks/api/useProjects'
import CardProyectos from '@/Components/CardProyectos'
import { Skeleton } from '@/components/ui/skeleton'

export default function Dashboard () {
  const { data: proyectos = [], isLoading } = useProjects()

  return (
    <div id="Dashboard" className="container mx-auto p-6">
      <section className="mb-6">
        <h1 className="text-2xl font-bold">Proyectos</h1>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && (
          <>
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
          </>
        )}

        {!isLoading && proyectos.map(({ title, _id, activos }) => (
          <CardProyectos key={_id} id={_id} name={title?.toUpperCase()} clientes={activos} />
        ))}
      </section>
    </div>
  )
}
