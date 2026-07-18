import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function SearchInput ({ placeholder, value, onChange, className = '' }) {
  return (
    <div className={`flex items-center gap-2 bg-white border border-[#e6ebea] rounded-[10px] px-3 py-2 ${className}`}>
      <Search className="w-[17px] h-[17px] text-[#8a9995]" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-0 outline-0 bg-transparent p-0 h-auto text-[13.5px] text-[#1a2621] placeholder:text-[#a3afab] focus-visible:ring-0"
      />
    </div>
  )
}
