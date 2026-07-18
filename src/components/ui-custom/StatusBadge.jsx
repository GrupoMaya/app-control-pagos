const statusStyles = {
  'Al corriente': { bg: '#e3f2f0', color: '#157a71' },
  'Atrasado': { bg: '#fdf0dc', color: '#c67c1e' },
  'Mora': { bg: '#fbe3df', color: '#c0392b' },
  'default': { bg: '#f1f5f4', color: '#5a6b66' }
}

export default function StatusBadge ({ status }) {
  const style = statusStyles[status] || statusStyles.default

  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ backgroundColor: style.bg, color: style.color }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: style.color }}
      />
      {status}
    </span>
  )
}
