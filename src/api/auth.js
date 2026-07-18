import { fetcher } from './client'

export async function login (credentials) {
  const data = await fetcher('/user/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  })

  if (data?.login?.token) {
    localStorage.setItem('tokenUserSite', data.login.token)
  }

  return data
}

export async function validateToken (token) {
  return fetcher(`/user/${decodeToken(token).id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export async function register (userData) {
  return fetcher('/user/register/', {
    method: 'POST',
    body: JSON.stringify(userData)
  })
}

import { jwtDecode } from 'jwt-decode'

export function decodeToken (token) {
  return jwtDecode(token)
}

export function logout () {
  localStorage.removeItem('tokenUserSite')
}
