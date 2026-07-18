import { fetcher } from './client'

export async function getSettings () {
  const data = await fetcher('/settingsapp/get')
  return (data.message || [])[0]
}

export async function patchSettings (data) {
  return fetcher('/settingsapp/dataInfo', {
    method: 'PATCH',
    body: JSON.stringify(data)
  })
}
