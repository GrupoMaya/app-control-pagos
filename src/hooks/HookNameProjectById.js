import { useEffect, useState } from 'react'
import { baseURL } from 'context/controllers'

const HookNameProjectById = ({ id }) => {
  const [project, setProject] = useState(undefined)
  const [loading, setLoading] = useState(false)

  useEffect(() => {    
    const fetchPoject = async () => {
      await fetch(`${baseURL}/proyecto/${id}`)
        .then(res => res.json())
        .then(res => setProject(res.message))
        .finally(setLoading(true))   
    }
    fetchPoject()
  }, [id])

  return { project, loading }
}

export default HookNameProjectById
