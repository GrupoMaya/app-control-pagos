import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as clientsApi from '@/api/clients'

export function useAllClients () {
  return useQuery({
    queryKey: ['clients'],
    queryFn: clientsApi.getAllClients
  })
}

export function useClient (id) {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => clientsApi.getClientById(id),
    enabled: Boolean(id)
  })
}

export function useClientDetail (id) {
  return useQuery({
    queryKey: ['clients', id, 'detail'],
    queryFn: () => clientsApi.getClientDetail(id),
    enabled: Boolean(id)
  })
}

export function useSearchClients () {
  return useMutation({
    mutationFn: clientsApi.searchClients
  })
}

export function useSearchPaymentsByRef () {
  return useMutation({
    mutationFn: clientsApi.searchPaymentsByRef
  })
}

export function usePatchClient () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }) => clientsApi.patchClient(id, body),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['clients', id] })
      queryClient.invalidateQueries({ queryKey: ['clients', id, 'detail'] })
    }
  })
}

export function useDocumentValues (documentType, id) {
  return useQuery({
    queryKey: ['documentValues', documentType, id],
    queryFn: () => clientsApi.getDocumentValues(documentType, id),
    enabled: Boolean(documentType && id)
  })
}
