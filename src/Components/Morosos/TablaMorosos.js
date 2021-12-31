/* eslint-disable camelcase */
import React, { useMemo, useState } from 'react'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Box
} from '@chakra-ui/react'
import { useHistory } from 'react-router-dom'
import DateIntlForma from 'utils/DateIntlFormat'
import eyeIcon from 'assets/icons/eye.svg'

const TablaMorosos = ({ data, current, key_data, title }) => {

  /**
   * @description
   * @param {object} data morosos
   * @param {object} xsate
   * @param {string} key_data
   * @param {string} title Clientes con mas de 30 días de su ultimo pago
   */

  const [isOpen, setIsopen] = useState(false)
  const show = () => setIsopen(!isOpen)

  const history = useHistory()
  const handledDetail = (lote, idProject, clienteNombre) => {
    history.push({
      pathname: `/detalle/lote/${lote.lote}/cliente/${clienteNombre}/projecto/${idProject}`,
      state: [lote]
    })
  }

  const selector = useMemo(() => {
    const sortValues = []
    current.matches('success') &&
      // eslint-disable-next-line camelcase
      Object.values(data[key_data]).forEach(({ proyecto_data }) => {
        const { title } = proyecto_data[0]
        return sortValues.includes(title) ? sortValues : sortValues.push(title)
      })
    return sortValues
  }, [current])

  const [filtredProjects, setFiltredProjects] = useState([])
  const handledFiltroProyecto = (e) => {
    const proyecto = e.target.value
    const currentProyects = current.matches('success') &&
      // eslint-disable-next-line camelcase
      Object.values(data[key_data]).filter(({ proyecto_data }) => {
        const { title } = proyecto_data[0]
        return proyecto === title
      })
    setFiltredProjects(currentProyects)
  }

  return (
    <>
      <Box sx={{ display: 'flex', gap: '10px' }}>
        <h6 className='important_title'>{title}</h6>
        <Button onClick={() => show()}>
          <img src={eyeIcon} alt='eye' width={30} />
        </Button>
      </Box>
      <Table variant="striped" colorScheme="teal" className='bg_esmeralda' hidden={!!isOpen}>
        <Thead>
          <Tr>
            <Th>Cliente</Th>
            <Th>
              {
                current.matches('success') &&
                <select
                  className='select_gde'
                  onChange={handledFiltroProyecto}
                  >
                    <option>Proyecto</option>
                    { selector.map((item, index) => {
                      return <option key={item + index} value={item} >{ item }</option>
                    })}
                </select>
              }
            </Th>
            <Th>Lote</Th>
            <Th>Inicio de Contrato</Th>
            <Th>Ultimo Pago</Th>
          </Tr>
        </Thead>
        <Tbody>
          {
            current.matches('success') &&
            filtredProjects.length === 0 &&
            Object
              .values(data && data[key_data])
              .map((pago) => {
                const lotes = pago.lote_data[0]
                const proyecto = pago.proyecto_data[0]
                const cliente = pago.cliente_data[0]

                return (
                  <Tr
                    style={{ pointer: 'cursor' }}
                    key={pago?._id}
                    onClick={() => handledDetail(lotes, proyecto._id, cliente.nombre)}>
                    <Td>{ cliente?.nombre }</Td>
                    <Td>{ proyecto?.title }</Td>
                    <Td>{ lotes?.lote }</Td>
                    <Td>{ lotes?.inicioContrato && <DateIntlForma date={lotes.inicioContrato} />}</Td>
                    <Td>{ pago?.mes && <DateIntlForma date={pago.mes} />}</Td>
                  </Tr>
                )
              })
          }
          {
            current.matches('success') &&
            filtredProjects.length > 0 &&
            Object
              .values(filtredProjects)
              .map((pago) => {
                const lotes = pago.lote_data[0]
                const proyecto = pago.proyecto_data[0]
                const cliente = pago.cliente_data[0]

                return (
                  <Tr
                    style={{ pointer: 'cursor' }}
                    key={pago?._id}
                    onClick={() => handledDetail(lotes, proyecto._id, cliente.nombre)}>
                    <Td>{ cliente?.nombre }</Td>
                    <Td>{ proyecto?.title }</Td>
                    <Td>{ lotes?.lote }</Td>
                    <Td>{ lotes?.inicioContrato && <DateIntlForma date={lotes.inicioContrato} />}</Td>
                    <Td>{ pago?.mes && <DateIntlForma date={pago.mes} />}</Td>
                  </Tr>
                )
              })
          }
        </Tbody>
      </Table>
    </>
  )
}

export default TablaMorosos
