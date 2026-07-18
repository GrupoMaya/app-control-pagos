import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CardProyectos ({ id, name, clientes }) {
  return (
    <Link to={`/proyecto/${id}/${name}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {Array.isArray(clientes) ? clientes.length : clientes ?? 0} clientes activos
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
