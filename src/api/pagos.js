import { fetcher, fetchBlob } from './client'
import { baseURL } from './client'

export async function getPagosByProject ({ idProject, clientID, loteID }) {
  const data = await fetcher(`/pagos/${idProject}?idcliente=${clientID}&idlote=${loteID}`)
  return data.message || []
}

export async function getPagoInfo (id) {
  const data = await fetcher(`/showinfoinvoice/${id}`)
  return data.message || []
}

export async function getPagoById (id) {
  const data = await fetcher(`/get/pago/${id}`)
  return data.message
}

export async function addPagoToLote (payload) {
  return fetcher('/lote/pago', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export async function postPago (id, payload) {
  return fetcher(`/pagarnota/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  })
}

export async function patchPago (id, payload) {
  return fetcher(`/update/pago/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  })
}

export async function updateFolio ({ id, folio, fixConsecutive }) {
  const token = localStorage.getItem('tokenUserSite')
  const baseURLV2 = baseURL.replace('v1', 'v2')
  const response = await fetch(`${baseURLV2}/pagos/folio/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ id, folio, fixConsecutive })
  })
  return response.json()
}

export async function generatePdf (folio, data) {
  const response = await fetch(`${baseURL}/pdf?folio=${folio}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return response.arrayBuffer()
}

export async function downloadResumenExcel ({ idProject, clientID }) {
  return fetchBlob(`/resumen/cliente/${clientID}/projecto/${idProject}`)
}
