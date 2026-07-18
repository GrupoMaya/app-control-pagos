import { fetcher } from './client'

export async function getAllClients () {
  const data = await fetcher('/cliente')
  return data.message || []
}

export async function getClientById (id) {
  const data = await fetcher(`/cliente/${id}`)
  return data.message
}

export async function getClientDetail (id) {
  const data = await fetcher(`/detail/client/${id}`)
  const message = data.message || {}
  return {
    ...message,
    lotes: (message.lotes || []).filter(({ isActive }) => isActive === true)
  }
}

export async function searchClients (keyword) {
  const data = await fetcher(`/search?user=${encodeURIComponent(keyword)}`)
  const results = data.message || {}
  if (Object.values(results).length === 0) {
    throw new Error('No existen usuarios con tus criterios de búsqueda')
  }
  return results
}

export async function searchPaymentsByRef (ref) {
  const data = await fetcher(`/search/ref/pagos?ref=${encodeURIComponent(ref)}`)
  const results = data.message || {}
  if (Object.values(results).length === 0) {
    throw new Error('No existen pagos con esa referencia')
  }
  return results
}

export async function patchClient (id, body) {
  return fetcher(`/modify/cliente/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body)
  })
}

export async function getDocumentValues (documentType, id) {
  const data = await fetcher(`/getnames/${documentType}/${id}`)
  return (data.message || [])[0]
}
