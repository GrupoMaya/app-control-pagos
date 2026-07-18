import { fetcher } from './client'

export async function getLotes (projectId) {
  const data = await fetcher(`/lotes/${projectId}`)
  return data.message || []
}

export async function getLotesByProjectId (projectId) {
  const data = await fetcher(`/lotes/proyecto/${projectId}`)
  return data.message || []
}

export async function getLotesByClientId (clientId) {
  const data = await fetcher(`/lotes/cliente/${clientId}`)
  return data.message || []
}

export async function getLoteById (id) {
  const data = await fetcher(`/lote/${id}`)
  return data.message
}

export async function assignLoteToNewUser (projectId, payload) {
  return fetcher(`/assign/lote/user/${projectId}/`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export async function addLoteToUser (projectId, payload) {
  return fetcher(`/add/lote/user/${projectId}/`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export async function patchLote (id, payload) {
  return fetcher(`/update/lote/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  })
}
