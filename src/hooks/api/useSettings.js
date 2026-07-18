import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as settingsApi from '@/api/settings'

export function useSettings () {
  return useQuery({
    queryKey: ['settings'],
    queryFn: settingsApi.getSettings
  })
}

export function usePatchSettings () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: settingsApi.patchSettings,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] })
  })
}
