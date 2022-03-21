import React, { useState, useMemo, useEffect } from 'react'

const SearchClientProyecto = ({ data, setCurrentClientes }) => {

  const [keyword, setKeyword] = useState('')

  const onHandledSubmit = useMemo(() => {
  // filter whit match methods
    const filter = Object.values(data).filter(({ clienteData }) => {
      const regex = new RegExp(`${keyword}`, 'gi')
      return clienteData[0]?.nombre.match(regex)
    })

    return filter
            
  }, [keyword])

  useEffect(() => {
    const copy = [...data]
    if (onHandledSubmit.length === 0 && keyword.length > 0) {
      setCurrentClientes([])

    } else if (onHandledSubmit.length === 0) {
      setCurrentClientes(copy)

    } else {
      setCurrentClientes(onHandledSubmit)
    }

  }, [onHandledSubmit, data])

  return (
    <div>
      <input
        defaultValue={keyword}
        className='buscador__cliente'
        onChange={(e) => setKeyword(e.target.value)}
        type="search"
        placeholder="Buscar por nombre del cliente">
      </input>
    </div>
  )
}

export default SearchClientProyecto
