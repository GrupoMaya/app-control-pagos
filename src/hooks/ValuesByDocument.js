import { useDocumentValues } from '@/hooks/api/useClients'
import { Skeleton } from '@/components/ui/skeleton'

export default function ValuesByDocument ({ id, documentType, cbValue }) {
  const { data: documentValues, isLoading } = useDocumentValues(documentType, id)

  if (isLoading) return <Skeleton className="h-4 w-24 inline-block" />
  if (!documentValues) return null

  return documentValues[cbValue]
}
