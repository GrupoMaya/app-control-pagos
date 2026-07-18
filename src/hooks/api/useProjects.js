import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as projectsApi from '@/api/projects'

export function useProjects () {
  return useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getProjects
  })
}

export function useProject (id) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => projectsApi.getProjectById(id),
    enabled: Boolean(id)
  })
}

export function useCreateProject () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: projectsApi.createProject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] })
  })
}

export function useUpdateProject () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => projectsApi.updateProject(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] })
  })
}
