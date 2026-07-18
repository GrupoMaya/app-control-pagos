import { useLocation, useNavigate } from 'react-router-dom'
import { useUserState, useUserDispatch } from '@/context/userContext'
import { useAppContext } from '@/context/AppContextProvider'
import {
  LayoutDashboard,
  Building2,
  AlertTriangle,
  LogOut,
  Home
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { id: 'proyectos', label: 'Proyectos', icon: Building2, path: '/' },
  { id: 'morosos', label: 'Morosos', icon: AlertTriangle, path: '/morosos' }
]

function getInitials (name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0]?.toUpperCase())
    .join('')
}

function isActivePath (pathname, prefix) {
  if (prefix === '/') return pathname === '/'
  return pathname.startsWith(prefix)
}

export default function Sidebar () {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useUserState()
  const { logout } = useUserDispatch()
  const { plataformName } = useAppContext()

  const brandName = plataformName || 'TIERRA MAYA'

  const handleNav = (path) => () => navigate(path)

  return (
    <aside className="w-[264px] flex-shrink-0 bg-white border-r border-[#e6ebea] flex flex-col p-5 px-4 h-screen">
      <div className="flex items-center gap-3 pb-6 px-2">
        <div className="w-10 h-10 rounded-[11px] bg-gradient-to-br from-[#1EA69A] to-[#50c9c3] flex items-center justify-center shadow-[0_4px_10px_rgba(30,166,154,0.28)]">
          <Home className="w-5 h-5 text-white" strokeWidth={2.2} />
        </div>
        <div className="leading-tight">
          <div className="font-heading font-extrabold text-base tracking-wide text-[#1a2621]">
            {brandName}
          </div>
          <div className="text-[11.5px] text-[#8a9995] tracking-widest">
            Control de Pagos
          </div>
        </div>
      </div>

      <div className="text-[11px] uppercase tracking-[0.09em] text-[#a3afab] px-3 pt-3 pb-1.5">
        General
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map(({ id, label, icon: Icon, path }) => {
          const active = isActivePath(location.pathname, path)
          return (
            <button
              key={id}
              onClick={handleNav(path)}
              className={[
                'flex items-center gap-3 w-full px-3 py-2.5 rounded-[10px] text-left transition-colors',
                active
                  ? 'bg-[#e9f6f4] text-[#157a71] font-semibold'
                  : 'bg-transparent text-[#5a6b66] hover:bg-[#f1f5f4]'
              ].join(' ')}
            >
              <Icon className="w-[18px] h-[18px]" />
              {label}
              {id === 'morosos' && (
                <span className="ml-auto bg-[#fdecea] text-[#d94436] text-[11px] font-bold px-2 py-0.5 rounded-full">
                  9
                </span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="mt-auto border-t border-[#eef2f1] pt-4 flex items-center gap-3">
        <div className="w-[38px] h-[38px] rounded-full bg-[#e3f2f0] text-[#157a71] font-bold flex items-center justify-center text-sm">
          {getInitials(user?.name)}
        </div>
        <div className="leading-tight min-w-0">
          <div className="text-[13.5px] font-medium text-[#1a2621] truncate">
            {user?.name || 'Usuario'}
          </div>
          <div className="text-[11.5px] text-[#8a9995] capitalize">
            {user?.role || 'Administrador'}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          title="Salir"
          onClick={logout}
          className="ml-auto text-[#a3afab] hover:text-[#d94436] hover:bg-[#fdecea]"
        >
          <LogOut className="w-[18px] h-[18px]" />
        </Button>
      </div>
    </aside>
  )
}
