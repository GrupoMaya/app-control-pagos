import { useQuery } from '@tanstack/react-query'
import * as morososApi from '@/api/morosos'

export function useMorosos () {
  return useQuery({
    queryKey: ['morosos'],
    queryFn: morososApi.getMorosos
  })
}
