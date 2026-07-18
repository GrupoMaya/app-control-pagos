import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as lotesApi from '@/api/lotes'

export function useLotesByProject (projectId) {
  return useQuery({
    queryKey: ['lotes', 'project', projectId],
    queryFn: () => lotesApi.getLotesByProjectId(projectId),
    enabled: Boolean(projectId)
  })
}

export function useLotesByClient (clientId) {
  return useQuery({
    queryKey: ['lotes', 'client', clientId],
    queryFn: () => lotesApi.getLotesByClientId(clientId),
    enabled: Boolean(clientId)
  })
}

export function useLote (id) {
  return useQuery({
    queryKey: ['lotes', id],
    queryFn: () => lotesApi.getLoteById(id),
    enabled: Boolean(id)
  })
}

export function useLotes (projectId) {
  return useQuery({
    queryKey: ['lotes', 'raw', projectId],
    queryFn: () => lotesApi.getLotes(projectId),
    enabled: Boolean(projectId)
  })
}

export function useAssignLoteToNewUser () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, payload }) => lotesApi.assignLoteToNewUser(projectId, payload),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['lotes', 'project', projectId] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    }
  })
}

export function useAddLoteToUser () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, payload }) => lotesApi.addLoteToUser(projectId, payload),
    onSuccess: (_, { payload }) => {
      queryClient.invalidateQueries({ queryKey: ['clients', payload.idUser, 'detail'] })
      queryClient.invalidateQueries({ queryKey: ['lotes', 'project', payload.idProyecto || payload.proyecto] })
    }
  })
}

export function usePatchLote () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => lotesApi.patchLote(id, payload),
    onSuccess: (_, { id, payload }) => {
      queryClient.invalidateQueries({ queryKey: ['lotes', id] })
      queryClient.invalidateQueries({ queryKey: ['lotes', 'project', payload.proyecto] })
    }
  })
}
