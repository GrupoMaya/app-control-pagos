import { fetcher } from './client'

export async function getMorosos () {
  const data = await fetcher('/morosos')
  return data.message || []
}
