import { useMemo } from 'react'
import { useMorosos } from '@/hooks/api/useMorosos'
import PageHeader from '@/components/layout/PageHeader'
import TablaMorosos from '@/Components/Morosos/TablaMorosos'
import { Skeleton } from '@/components/ui/skeleton'

export default function Morosos () {
  const { data: morosos, isLoading } = useMorosos()

  const treinta = useMemo(() => morosos?.treinta_dias || {}, [morosos])
  const sesenta = useMemo(() => morosos?.sesenta_dias || {}, [morosos])

  const totalTreinta = Object.keys(treinta).length
  const totalSesenta = Object.keys(sesenta).length

  return (
    <>
      <PageHeader title="Clientes morosos" subtitle="Seguimiento de pagos atrasados" />

      <main className="flex-1 overflow-y-auto p-7">
        <div className="max-w-[1180px] mx-auto animate-fade-up space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[18px]">
            {isLoading && (
              <>
                <Skeleton className="h-[104px] rounded-2xl" />
                <Skeleton className="h-[104px] rounded-2xl" />
                <Skeleton className="h-[104px] rounded-2xl" />
              </>
            )}
            {!isLoading && (
              <>
                <div className="bg-white border border-[#e6ebea] rounded-2xl p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                  <div className="text-[13px] text-[#8a9995]">Total morosos</div>
                  <div className="font-heading font-extrabold text-[28px] text-[#1a2621] mt-2">
                    {totalTreinta + totalSesenta}
                  </div>
                </div>
                <div className="bg-white border border-[#f6d9b8] rounded-2xl p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                  <div className="text-[13px] text-[#c67c1e]">+30 días</div>
                  <div className="font-heading font-extrabold text-[28px] text-[#e08e1a] mt-2">
                    {totalTreinta}
                  </div>
                </div>
                <div className="bg-white border border-[#f3c9c3] rounded-2xl p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                  <div className="text-[13px] text-[#c0392b]">+60 días</div>
                  <div className="font-heading font-extrabold text-[28px] text-[#d94436] mt-2">
                    {totalSesenta}
                  </div>
                </div>
              </>
            )}
          </div>

          {!isLoading && (
            <>
              <TablaMorosos
                data={treinta}
                title="Clientes con más de 30 días sin pagar"
                variant="orange"
              />
              <TablaMorosos
                data={sesenta}
                title="Clientes con más de 60 días sin pagar"
                variant="red"
              />
            </>
          )}
        </div>
      </main>
    </>
  )
}
