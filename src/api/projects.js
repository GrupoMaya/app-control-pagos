import { fetcher } from './client'

export async function getProjects () {
  const data = await fetcher('/proyectos')
  return data.message || []
}

export async function getProjectById (id) {
  const data = await fetcher(`/proyecto/${id}`)
  return data.message
}

export async function createProject (payload) {
  return fetcher('/add/proyecto', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export async function updateProject (id, payload) {
  return fetcher(`/update/proyecto/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  })
}
