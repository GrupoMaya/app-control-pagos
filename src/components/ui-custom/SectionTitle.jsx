export default function SectionTitle ({ children, dotColor, className = '' }) {
  return (
    <div className={`flex items-center gap-2 mb-3 ${className}`}>
      {dotColor && (
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }} />
      )}
      <h3 className="font-heading font-bold text-base text-[#1a2621]">
        {children}
      </h3>
    </div>
  )
}
