import { useEffect } from 'react'
import NumberFormat from 'utils/NumberFormat'
import { Link } from 'react-router-dom'

import { useMayaDispatch, useMayaState } from 'context/MayaMachine'

const Proyecto = ({ match }) => {

  const state = useMayaState()
  const dispatch = useMayaDispatch()
  
  const { slug, projectName } = match.params

  useEffect(() => {
    dispatch('GET_DATA', { id: slug })
  }, [match])

  const { proyecto } = state.context
      
  return (
    // @params proyecto css
    <div className="proyecto__container">
    <section className="proyecto__header">

      <div className="proyecto__header__title">
        <h3>{ projectName }</h3>
      </div>
  
        <section className="proyecto__data__info">
            {/* INFORMACION ESTATISTICO DEL PROYECTO */}
        </section>
    </section>
    <section className="proyecto__table">  
      <table>
        <tr className="head__data__table">
          <th>Lote</th>
          <th>Manzana</th>
          <th>Precio Total</th>
          <th>Cliente</th>
          <th>Acciones</th>
        </tr>
        {
          state.matches('success') &&
          Object.values(proyecto)
            .filter(item => item.clienteData.length > 0)
            .map((item, index) => {
              const loteInfo = [item]
              const loteid = item.lote
              return (
                <tr 
                  key={index} 
                  className="tabla__data"
                  >
                  <td>{ item.lote }</td>
                  <td>{ item.manzana }</td>
                  <td>{ <NumberFormat number={item.precioTotal}/> }</td>
                  {
                    Object.values(item.clienteData)
                      .map(item => {
                        return (
                        <>
                        <td key={item._id}>
                            { item.nombre }
                        </td>
                        <td>
                          <Link
                            to={{
                              pathname: `/detalle/lote/${loteid}/cliente/${item.nombre}/projecto/${projectName}`,
                              state: loteInfo
                            }}>
                            <button>Ver</button>
                          </Link>
                        </td>
                        </>
                        ) 
                      })
                  }
                </tr>
              )
            })
        }
      </table>
    </section>
    </div>
  )
}

export default Proyecto
