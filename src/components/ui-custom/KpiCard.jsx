import { TrendingUp, TrendingDown } from 'lucide-react'

export default function KpiCard ({ icon: Icon, iconBg, iconColor, value, label, trend, trendColor, trendBg }) {
  const isNegative = trend?.startsWith('-')

  return (
    <div className="bg-white border border-[#e6ebea] rounded-2xl p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-[11px] flex items-center justify-center"
          style={{ backgroundColor: iconBg }}
        >
          {Icon && <Icon className="w-5 h-5" style={{ color: iconColor }} />}
        </div>
        {trend && (
          <span
            className="text-xs font-semibold px-2 py-[3px] rounded-full flex items-center gap-1"
            style={{ color: trendColor, backgroundColor: trendBg }}
          >
            {isNegative ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
            {trend}
          </span>
        )}
      </div>
      <div className="font-heading font-extrabold text-[28px] text-[#1a2621] mt-4 leading-none">
        {value}
      </div>
      <div className="text-[13px] text-[#8a9995] mt-1.5">{label}</div>
    </div>
  )
}
