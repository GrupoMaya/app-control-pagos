import React, { memo, useEffect } from 'react'
import { useMachine } from '@xstate/react'
import ClienteDetailContext from 'context/ClienteDetailContext'
import { useHistory } from 'react-router-dom'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Container,
  Box,
  Heading,
  Text,
  Stack,
  Divider,
  Spinner
  // Button
} from '@chakra-ui/react'
// import NumberFormat from 'utils/NumberFormat'
import DateIntlForma from 'utils/DateIntlFormat'
// import ValuesByDocument from 'hooks/ValuesByDocument'
// import DrawNuevoCiente from 'Modales/DrawNuevoCiente'

const Morosos = (props) => {

  // const [isOpen, setIsOpen] = useState(false)
  const [current, send] = useMachine(ClienteDetailContext)

  useEffect(() => {
    send('GET_MOROSOS')
  }, [props])
  
  const { morosos } = current.context
  // eslint-disable-next-line camelcase

  const history = useHistory()
  const handledDetail = (lote, idProject, clienteNombre) => {
    history.push({
      pathname: `/detalle/lote/${lote.lote}/cliente/${clienteNombre}/projecto/${idProject}`,
      state: [lote]
    })
  }

  return (
  <>
    <Container maxW="container.lg">
      <Box mt={5} mb={3} maxW="100%" minH="10rem">
        <Heading mb={4}>
        </Heading>
        <Text fontSize="xl">
          Lista de Clientes Morosos, 30 días y más de 60 dias, desde su último pago
          <Divider orientation="vertical" />
          <Text>Selecciona una fila para ir a la pantalla de pagos.</Text>
        </Text>
      </Box>
      <h6 className='important_title'>Clientes con mas de 30 días de su ultimo pago</h6>
      <Table variant="striped" colorScheme="teal" className='bg_esmeralda'>
        <TableCaption>
          Clientes con más de 30 días desde su último pago
        </TableCaption>
        <Thead>
          <Tr>
            <Th>Cliente</Th>
            <Th>Proyecto</Th>
            <Th>Lote</Th>
            <Th>Inicio de Contrato</Th>
            <Th>Ultimo Pago</Th>
          </Tr>
        </Thead>
        <Tbody>
          {
            current.matches('success') && Object
              .values(morosos && morosos.treinta_dias)
              .map((pago) => {
                const lotes = pago.lote_data[0]
                const proyecto = pago.proyecto_data[0]
                const cliente = pago.cliente_data[0]

                return (
                  <Tr
                    style={{ pointer: 'cursor' }}
                    key={pago?._id}
                    onClick={() => handledDetail(lotes, proyecto._id, cliente.nombre)}>
                    <Td>{ cliente.nombre }</Td>
                    <Td>{ proyecto.title }</Td>
                    <Td>{ lotes.lote }</Td>
                    <Td>{ lotes.inicioContrato && <DateIntlForma date={lotes.inicioContrato} />}</Td>
                    <Td>{ pago.mes && <DateIntlForma date={pago.mes} />}</Td>
                  </Tr>
                )
              })
          }
        {
          current.matches('loadMorosos') && <Spinner />
        }
        </Tbody>
      </Table>
      <Stack direction="row" h="100px" p={4}>
        <Divider orientation="vertical" />
        <Text>Chakra UI</Text>
      </Stack>
      <h6 className='important_title'>Clientes con más de 60 días de su ultimo pago</h6>
      <Table variant="striped" colorScheme="teal" className='bg_esmeralda'>
        <TableCaption>
          Clientes con más de 60 días desde su último pago
        </TableCaption>
        <Thead>
          <Tr>
            <Th>Cliente</Th>
            <Th>Proyecto</Th>
            <Th>Lote</Th>
            <Th>Inicio de Contrato</Th>
            <Th>Ultimo Pago</Th>
          </Tr>
        </Thead>
        <Tbody>
          {
            current.matches('success') && Object
              .values(morosos && morosos.sesenta_dias)
              .map((pago) => {
                const lotes = pago.lote_data[0]
                const proyecto = pago.proyecto_data[0]
                const cliente = pago.cliente_data[0]

                return (
                    <Tr
                    style={{ pointer: 'cursor' }}
                    key={pago?._id}
                    onClick={() => handledDetail(lotes, proyecto._id, cliente.nombre)}>
                    <Td>{ cliente.nombre }</Td>
                    <Td>{ proyecto.title }</Td>
                    <Td>{ lotes.lote }</Td>
                    <Td>{ lotes.inicioContrato && <DateIntlForma date={lotes.inicioContrato} />}</Td>
                    <Td>{ pago.mes && <DateIntlForma date={pago.mes} />}</Td>
                  </Tr>
                )
              })
          }
          {
             current.matches('loadMorosos') && <Spinner />
          }
        </Tbody>
      </Table>
    </Container>
  </>
  )
}

export default memo(Morosos)
