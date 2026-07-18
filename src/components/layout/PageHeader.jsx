import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell } from 'lucide-react'
import { useSearchClients } from '@/hooks/api/useClients'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function PageHeader ({ title, subtitle }) {
  const navigate = useNavigate()
  const searchMutation = useSearchClients()
  const [keyword, setKeyword] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!keyword.trim()) return
    try {
      const results = await searchMutation.mutateAsync(keyword.trim())
      const first = Object.values(results)[0]
      if (first?._id) {
        navigate(`/cliente/${first._id}`)
        setKeyword('')
      }
    } catch {
      // Mutation errors are handled by the hook
    }
  }

  return (
    <header className="h-[66px] flex-shrink-0 bg-white/85 backdrop-blur-[8px] border-b border-[#e6ebea] flex items-center gap-4 px-7">
      <div>
        <h1 className="font-heading font-bold text-xl text-[#1a2621] leading-none">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[12.5px] text-[#8a9995] mt-[3px]">{subtitle}</p>
        )}
      </div>

      <div className="ml-auto flex items-center gap-3">
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 bg-[#f1f5f4] border border-[#e6ebea] rounded-[10px] px-3 py-2 w-[280px]"
        >
          <Search className="w-[17px] h-[17px] text-[#8a9995]" />
          <Input
            placeholder="Buscar cliente o lote..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="border-0 outline-0 bg-transparent p-0 h-auto text-[13.5px] text-[#1a2621] placeholder:text-[#a3afab] focus-visible:ring-0"
          />
        </form>

        <Button
          variant="outline"
          size="icon"
          className="w-10 h-10 rounded-[10px] border-[#e6ebea] bg-white text-[#5a6b66] relative hover:bg-[#f1f5f4]"
        >
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-[9px] right-[10px] w-[7px] h-[7px] bg-[#e74c3c] rounded-full border-[1.5px] border-white" />
        </Button>
      </div>
    </header>
  )
}
