export default function AvatarInitials ({ name, bg, color, size = 'md' }) {
  const initials = name
    ?.split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0]?.toUpperCase())
    .join('') || '??'

  const sizeClasses = {
    sm: 'w-[30px] h-[30px] text-xs',
    md: 'w-[38px] h-[38px] text-sm',
    lg: 'w-[66px] h-[66px] text-2xl',
    xl: 'w-[72px] h-[72px] text-[26px]'
  }

  return (
    <div
      className={`rounded-full font-bold flex items-center justify-center flex-shrink-0 ${sizeClasses[size]}`}
      style={{ backgroundColor: bg, color }}
    >
      {initials}
    </div>
  )
}
