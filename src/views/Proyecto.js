import { useEffect, useState } from 'react'
import { Box, Select } from '@chakra-ui/react'
import NumberFormat from 'utils/NumberFormat'
import { Link, useHistory } from 'react-router-dom'
import DateIntlFormat from 'utils/DateIntlFormat'
import UpdateModal from 'Modales/UpdateModal/UpdateModal'
import { useMayaDispatch, useMayaState } from 'context/MayaMachine'
import SearchClientProyecto from 'utils/SearchClientProyecto'

const Proyecto = ({ match }) => {

  const { state } = useMayaState()
  const { dispatch, setXstateQuery } = useMayaDispatch()
  
  const { slug, projectName } = match.params
  
  useEffect(() => {
    dispatch('GET_DATA', { payload: slug })
  }, [match])

  useEffect(() => {
    setXstateQuery({ payload: slug, send: dispatch })
  }, [])

  const { proyecto } = state.context
  const [currentClientes, setCurrentClientes] = useState([])

  const history = useHistory()

  const handleSelectLoteFilter = (e) => {
    const keyTargetValue = e.target.value
    const keyParse = JSON.parse(keyTargetValue)
    const loteNumber = keyParse.lote
    const [nombreCliente] = keyParse.clienteData.map(item => item.nombre)
    const clientURL = nombreCliente.replace(/\//g, '-')
    const projectObjectID = keyParse.proyecto.toString()

    history.push({
      pathname: `/detalle/lote/${loteNumber}/cliente/${clientURL}/projecto/${projectObjectID}`,
      state: [keyParse]
    })
  }

  return (
    // @params proyecto css
    <div className="proyecto__container">
    <section className="proyecto__header">

      <div className="proyecto__header__title">
        <h3>{ projectName }</h3>
      </div>
  
        <section className="proyecto__data__info">
        {/* INFORMACION "ESTADISTICO" DEL PROYECTO */}
        </section>
    <div className="ntf__results">
      {
        state.matches('getProyectoByID') && <span className="logo__loader__await" />
      }
      {
        state.matches('success') && Object.values(proyecto).length === 0 && <span>No hay Elementos para mostrar</span>
      }
  </div>
  {/* buscador web */}
      {
        state.matches('success') &&
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            padding: '1rem',
            justifyContent: 'space-between'

          }}>
            <SearchClientProyecto
            data={proyecto}
            setCurrentClientes={setCurrentClientes}
          />
          <Select placeholder='Todos los lotes' size="md" onChange={handleSelectLoteFilter}>
            {
              proyecto
                .sort((a, b) => +a.lote - +b.lote)
                .map((item) => {
                  return (
                    <option
                      key={item._id}
                      value={JSON.stringify(item)}>
                        {`Lote ${item.lote} - Manzana ${item.manzana}`}
                    </option>
                  )
                })
            }
          </Select>
          </Box>
      }
    </section>
    <section className="proyecto__table">
      <table>
        <tr className="head__data__table">
          <th>Lote</th>
          <th>Manzana</th>
          <th>Precio Total</th>
          <th>Incio de contrato</th>
          <th>Cliente</th>
          <th>Acciones</th>
        </tr>
        {
           state.matches('success') &&
           currentClientes.length === 0 &&
           <p style={{ fontSize: '24px' }}>No se encontraron lotes &#128577;</p>
        }
        {
          state.matches('success') &&
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
                  <td>{ item.manzana }</td>
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
                            <UpdateModal
                              id={parentLoteId}
                              document="Lote"
                              dispatch={dispatch}
                            />
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
    </div>
  )
}

export default Proyecto
