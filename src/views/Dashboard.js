import { useMemo, useState } from 'react'
import { useProjects } from '@/hooks/api/useProjects'
import { useMorosos } from '@/hooks/api/useMorosos'
import { useUserState } from '@/context/userContext'
import PageHeader from '@/components/layout/PageHeader'
import KpiCard from '@/components/ui-custom/KpiCard'
import ProjectCard from '@/components/ui-custom/ProjectCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Plus, Building2, LayoutGrid, DollarSign, AlertTriangle } from 'lucide-react'
import NuevoProject from '@/Modales/NuevoProject'

const banners = [
  'linear-gradient(120deg, #178f85, #50c9c3)',
  'linear-gradient(120deg, #2f7de0, #6fb0f5)',
  'linear-gradient(120deg, #6a4bc0, #a78be6)',
  'linear-gradient(120deg, #c67c1e, #f0b445)',
  'linear-gradient(120deg, #c0392b, #e74c3c)',
  'linear-gradient(120deg, #1a2621, #5a6b66)'
]

export default function Dashboard () {
  const { user } = useUserState()
  const { data: proyectos = [], isLoading: loadingProjects } = useProjects()
  const { data: morosos, isLoading: loadingMorosos } = useMorosos()
  const [openProject, setOpenProject] = useState(false)

  const kpis = useMemo(() => {
    const totalClientes = proyectos.reduce((sum, p) => {
      const count = Array.isArray(p.activos) ? p.activos.length : p.activos ?? 0
      return sum + count
    }, 0)

    const treinta = Object.values(morosos?.treinta_dias || {})
    const sesenta = Object.values(morosos?.sesenta_dias || {})
    const totalMorosos = treinta.length + sesenta.length

    return [
      {
        label: 'Proyectos activos',
        value: String(proyectos.length),
        trend: '+1',
        trendColor: '#157a71',
        trendBg: '#e3f2f0',
        iconBg: '#e3f2f0',
        iconColor: '#1EA69A',
        icon: Building2
      },
      {
        label: 'Clientes activos',
        value: String(totalClientes),
        trend: '+8',
        trendColor: '#157a71',
        trendBg: '#e3f2f0',
        iconBg: '#eaf2fd',
        iconColor: '#2f7de0',
        icon: LayoutGrid
      },
      {
        label: 'Cobrado en el mes',
        value: '$—',
        trend: '+12%',
        trendColor: '#157a71',
        trendBg: '#e3f2f0',
        iconBg: '#eef7ea',
        iconColor: '#5aa444',
        icon: DollarSign
      },
      {
        label: 'Clientes morosos',
        value: String(totalMorosos),
        trend: totalMorosos > 0 ? `+${totalMorosos}` : '0',
        trendColor: '#d94436',
        trendBg: '#fdecea',
        iconBg: '#fdecea',
        iconColor: '#e74c3c',
        icon: AlertTriangle
      }
    ]
  }, [proyectos, morosos])

  const isLoading = loadingProjects || loadingMorosos

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Resumen general de proyectos y cobranza" />

      <main className="flex-1 overflow-y-auto p-7">
        <div className="max-w-[1180px] mx-auto animate-fade-up space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18px]">
            {isLoading && (
              <>
                <Skeleton className="h-[132px] rounded-2xl" />
                <Skeleton className="h-[132px] rounded-2xl" />
                <Skeleton className="h-[132px] rounded-2xl" />
                <Skeleton className="h-[132px] rounded-2xl" />
              </>
            )}
            {!isLoading && kpis.map((kpi, i) => (
              <KpiCard key={i} {...kpi} />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-lg text-[#1a2621]">Proyectos</h2>
            {user?.role === 'admin' && (
              <Button
                onClick={() => setOpenProject(true)}
                className="bg-[#1EA69A] hover:bg-[#178f85] text-white rounded-[10px] px-4 py-2.5 text-[13.5px] font-medium shadow-[0_4px_10px_rgba(30,166,154,0.25)] flex items-center gap-2"
              >
                <Plus className="w-4 h-4" strokeWidth={2.4} />
                Añadir Proyecto
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
            {loadingProjects && (
              <>
                <Skeleton className="h-[220px] rounded-2xl" />
                <Skeleton className="h-[220px] rounded-2xl" />
                <Skeleton className="h-[220px] rounded-2xl" />
              </>
            )}
            {!loadingProjects && proyectos.map((p, i) => {
              const activos = Array.isArray(p.activos) ? p.activos.length : p.activos ?? 0
              return (
                <ProjectCard
                  key={p._id}
                  id={p._id}
                  name={p.title?.toUpperCase()}
                  status={p.status || 'Activo'}
                  lotes={String(activos)}
                  cobrado="$—"
                  pct="—"
                  banner={banners[i % banners.length]}
                />
              )
            })}
          </div>
        </div>
      </main>

      <NuevoProject visible={openProject} onCancel={setOpenProject} />
    </>
  )
}
