import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as pagosApi from '@/api/pagos'
import { saveAs } from 'file-saver'

export function usePagosByProject ({ idProject, clientID, loteID }) {
  return useQuery({
    queryKey: ['pagos', 'project', idProject, clientID, loteID],
    queryFn: () => pagosApi.getPagosByProject({ idProject, clientID, loteID }),
    enabled: Boolean(idProject && clientID && loteID)
  })
}

export function usePagoInfo (id) {
  return useQuery({
    queryKey: ['pagos', 'info', id],
    queryFn: () => pagosApi.getPagoInfo(id),
    enabled: Boolean(id)
  })
}

export function usePago (id) {
  return useQuery({
    queryKey: ['pagos', id],
    queryFn: () => pagosApi.getPagoById(id),
    enabled: Boolean(id)
  })
}

export function useAddPagoToLote () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: pagosApi.addPagoToLote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pagos'] })
  })
}

export function usePostPago () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => pagosApi.postPago(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pagos'] })
  })
}

export function usePatchPago () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => pagosApi.patchPago(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pagos'] })
  })
}

export function useUpdateFolio () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: pagosApi.updateFolio,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pagos'] })
  })
}

export function useDownloadResumenExcel () {
  return useMutation({
    mutationFn: async (params) => {
      const blob = await pagosApi.downloadResumenExcel(params)
      saveAs(blob, 'scheduler.xlsx')
    }
  })
}

export function useGeneratePdf () {
  return useMutation({
    mutationFn: async ({ folio, data }) => {
      const buffer = await pagosApi.generatePdf(folio, data)
      const blob = new Blob([buffer], { type: 'application/pdf' })
      return blob
    }
  })
}
