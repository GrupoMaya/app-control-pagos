import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useUserState, useUserDispatch } from '@/context/userContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Login () {
  const { user, error } = useUserState()
  const { login } = useUserDispatch()
  const navigate = useNavigate()
  const [showError, setShowError] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  useEffect(() => {
    if (error) {
      setShowError(true)
      const t = setTimeout(() => setShowError(false), 4000)
      return () => clearTimeout(t)
    }
  }, [error])

  const onSubmit = async (data) => {
    try {
      await login(data)
    } catch {
      // error handled via context state
    }
  }

  return (
    <div id="Login" className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Inicio de sesión</CardTitle>
        </CardHeader>
        <CardContent>
          {showError && (
            <p className="text-destructive text-sm mb-4 text-center">
              Error en la contraseña o email
            </p>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { required: true })}
              />
              {errors.email && <span className="text-xs text-destructive">Campo requerido</span>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                {...register('password', { required: true })}
              />
              {errors.password && <span className="text-xs text-destructive">Campo requerido</span>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
