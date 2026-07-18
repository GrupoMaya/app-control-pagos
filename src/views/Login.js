import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useUserState, useUserDispatch } from '@/context/userContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Home, Mail, Lock, Eye, ArrowRight } from 'lucide-react'

export default function Login () {
  const { user, error } = useUserState()
  const { login } = useUserDispatch()
  const navigate = useNavigate()
  const [showError, setShowError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
    <div className="fixed inset-0 z-50 flex">
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-[#178f85] via-[#1EA69A] to-[#50c9c3] overflow-hidden">
        <div className="absolute -top-20 -right-16 w-[280px] h-[280px] rounded-full bg-white/8" />
        <div className="absolute -bottom-24 -left-16 w-[320px] h-[320px] rounded-full bg-white/6" />

        <div className="relative h-full flex flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <div className="w-[46px] h-[46px] rounded-[13px] bg-white/18 border border-white/30 flex items-center justify-center">
              <Home className="w-6 h-6 text-white" strokeWidth={2.2} />
            </div>
            <div className="font-heading font-extrabold text-xl text-white tracking-wide">
              GRUPO TIERRA MAYA
            </div>
          </div>

          <div>
            <h1 className="font-heading font-extrabold text-[40px] text-white leading-[1.08] mb-4">
              Control de pagos<br />de tus lotes,<br />en un solo lugar.
            </h1>
            <p className="text-[15px] text-white/85 max-w-[400px] leading-relaxed">
              Gestiona proyectos, clientes, mensualidades y morosos con reportes claros y exportables.
            </p>
          </div>

          <div className="text-[12.5px] text-white/70">
            © 2026 Grupo Tierra Maya · Todos los derechos reservados
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-[#f4f7f6]">
        <div className="w-full max-w-[380px] animate-fade-up">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-[42px] h-[42px] rounded-xl bg-gradient-to-br from-[#1EA69A] to-[#50c9c3] flex items-center justify-center shadow-[0_4px_10px_rgba(30,166,154,0.28)]">
              <Home className="w-[22px] h-[22px] text-white" strokeWidth={2.2} />
            </div>
            <div className="leading-tight">
              <div className="font-heading font-extrabold text-base text-[#1a2621]">TIERRA MAYA</div>
              <div className="text-[11.5px] text-[#8a9995]">Control de Pagos</div>
            </div>
          </div>

          <h2 className="font-heading font-extrabold text-[26px] text-[#1a2621] mb-1">Inicia sesión</h2>
          <p className="text-sm text-[#8a9995] mb-7">Ingresa tus credenciales para continuar.</p>

          {showError && (
            <p className="text-[#d94436] text-sm mb-4 text-center bg-[#fdecea] rounded-lg py-2">
              Error en la contraseña o email
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[13px] font-semibold text-[#5a6b66]">
                Correo electrónico
              </Label>
              <div className="flex items-center gap-2.5 bg-[#f1f5f4] border border-[#e6ebea] rounded-[11px] px-3.5 py-3">
                <Mail className="w-[17px] h-[17px] text-[#8a9995]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tucorreo@tierramaya.com"
                  {...register('email', { required: true })}
                  className="border-0 outline-0 bg-transparent p-0 h-auto text-sm text-[#1a2621] placeholder:text-[#a3afab] focus-visible:ring-0"
                />
              </div>
              {errors.email && <span className="text-xs text-[#d94436]">Campo requerido</span>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[13px] font-semibold text-[#5a6b66]">
                Contraseña
              </Label>
              <div className="flex items-center gap-2.5 bg-[#f1f5f4] border border-[#e6ebea] rounded-[11px] px-3.5 py-3">
                <Lock className="w-[17px] h-[17px] text-[#8a9995]" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', { required: true })}
                  className="border-0 outline-0 bg-transparent p-0 h-auto text-sm text-[#1a2621] placeholder:text-[#a3afab] focus-visible:ring-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="text-[#a3afab] hover:text-[#5a6b66]"
                >
                  <Eye className="w-[17px] h-[17px]" />
                </button>
              </div>
              {errors.password && <span className="text-xs text-[#d94436]">Campo requerido</span>}
            </div>

            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-[13px] text-[#5a6b66] cursor-pointer">
                <Checkbox className="border-[#e6ebea] data-[state=checked]:bg-[#1EA69A] data-[state=checked]:border-[#1EA69A]" />
                Recordarme
              </Label>
              <a href="#" className="text-[13px] font-semibold text-[#157a71] hover:text-[#1EA69A]">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1EA69A] hover:bg-[#178f85] text-white rounded-[11px] py-5 text-[15px] font-semibold shadow-[0_6px_14px_rgba(30,166,154,0.28)] flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
              {!isSubmitting && <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2.2} />}
            </Button>
          </form>

          <p className="text-center text-[12.5px] text-[#a3afab] mt-7">
            ¿Problemas para acceder? Contacta al administrador.
          </p>
        </div>
      </div>
    </div>
  )
}
