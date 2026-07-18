import { Link } from 'react-router-dom'

export default function ProjectCard ({ id, name, status, lotes, cobrado, pct, banner }) {
  return (
    <Link to={`/proyecto/${id}/${name}`}>
      <div className="bg-white border border-[#e6ebea] rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_12px_24px_rgba(16,24,40,0.09)]">
        <div
          className="h-[118px] relative flex items-end p-3.5"
          style={{ background: banner }}
        >
          <span className="absolute top-3 right-3 bg-white/92 text-[#157a71] text-[11.5px] font-bold px-2.5 py-1 rounded-full">
            {status}
          </span>
          <div className="font-heading font-extrabold text-[19px] text-white uppercase tracking-wide drop-shadow-md">
            {name}
          </div>
        </div>

        <div className="p-4 px-[18px]">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-heading font-extrabold text-2xl text-[#1a2621] leading-none">
                {lotes}
              </div>
              <div className="text-[12.5px] text-[#8a9995] mt-[3px]">Lotes activos</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-[15px] text-[#1EA69A]">{cobrado}</div>
              <div className="text-[12.5px] text-[#8a9995] mt-[3px]">Cobrado / mes</div>
            </div>
          </div>

          <div className="mt-3.5 h-[7px] bg-[#eef2f1] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#1EA69A] to-[#50c9c3]"
              style={{ width: pct }}
            />
          </div>
          <div className="flex justify-between mt-[7px] text-[11.5px] text-[#a3afab]">
            <span>Avance de cobranza</span>
            <span className="text-[#5a6b66] font-semibold">{pct}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
