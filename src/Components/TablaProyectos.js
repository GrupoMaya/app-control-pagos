import NumberFormat from 'utils/NumberFormat'
import { Link } from 'react-router-dom'
import DateIntlFormat from 'utils/DateIntlFormat'
import UpdateModal from 'Modales/UpdateModal/UpdateModal'

const TablasProyectos = ({ currentClientes, isLoading, headerTab }) => {
  <section className="proyecto__table">
  <table>
    <tr className="head__data__table">
        {
          headerTab.map((item, index) => <th key={index + item}>{item}</th>)
        }
    </tr>
    {
       isLoading &&
       currentClientes.length === 0 &&
       <p style={{ fontSize: '24px' }}>No se encontraron lotes &#128577;</p>
    }
    {
      isLoading &&
      Object.values(currentClientes)
        .filter(item => item.clienteData.length > 0)
        .map((item, index) => {
          const parentLoteId = item._id
          const loteInfo = [item]
          const loteid = item.lote
          const [idProyecto] = item.proyecto
          return (
            <tr
              key={index}
              className="tabla__data"
              >
              <td>{ item.lote }</td>
              <td>{ <NumberFormat number={item.precioTotal}/> }</td>
              <td>
                {
                  item.inicioContrato && <DateIntlFormat date={item.inicioContrato} />
                }
              </td>
              {
                Object.values(item.clienteData)
                  .map(item => {
                    const clientURL = item.nombre.replace(/\//g, '-')
                    return (
                    <>
                    <td key={item._id}>
                        { item.nombre }
                    </td>
                    <td>
                      <span className="d-flex center">
                        <Link
                          to={{
                            pathname: `/detalle/lote/${loteid}/cliente/${clientURL}/projecto/${(idProyecto)}`,
                            state: loteInfo
                          }}>
                          <button>Ver</button>
                        </Link>
                        <UpdateModal id={parentLoteId} document="Lote"/>
                      </span>
                    <small className='id__inform'>
                      {item._id}
                    </small>
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
}

export default TablasProyectos
