const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
  // eslint-disable-next-line no-console
  console.error('VITE_API_URL no está definida. Configura la variable de entorno en Netlify o en un archivo .env')
}

export const baseURL = API_URL || ''

function getToken () {
  return localStorage.getItem('tokenUserSite')
}

export async function fetcher (endpoint, options = {}) {
  const url = `${baseURL}${endpoint}`
  const headers = {
    Accept: 'application/json',
    ...options.headers
  }

  if (options.body && typeof options.body === 'string') {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(url, {
    ...options,
    headers
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }))
    throw new Error(error.message || `Error ${response.status}`)
  }

  return response.json()
}

export async function fetchWithAuth (endpoint, options = {}) {
  const token = getToken()
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`
  }
  return fetcher(endpoint, { ...options, headers })
}

export async function fetchBlob (endpoint, options = {}) {
  const url = `${baseURL}${endpoint}`
  const token = getToken()
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers
    }
  })

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`)
  }

  return response.blob()
}
