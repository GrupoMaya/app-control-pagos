import { useState, useMemo, useEffect } from 'react'
import { Input } from '@/components/ui/input'

export default function SearchClientProyecto ({ data = [], setCurrentClientes }) {
  const [keyword, setKeyword] = useState('')

  const filtered = useMemo(() => {
    if (!keyword) return data
    const regex = new RegExp(keyword, 'gi')
    return data.filter(({ clienteData }) => clienteData[0]?.nombre?.match(regex))
  }, [keyword, data])

  useEffect(() => {
    setCurrentClientes(filtered)
  }, [filtered, setCurrentClientes])

  return (
    <Input
      type="search"
      placeholder="Buscar por nombre del cliente"
      className="buscador__cliente"
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
    />
  )
}
