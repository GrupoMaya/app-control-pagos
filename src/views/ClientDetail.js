import React, { useEffect, useState } from 'react'
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
  Spinner,
  Button
} from '@chakra-ui/react'
import NumberFormat from 'utils/NumberFormat'
import DateIntlForma from 'utils/DateIntlFormat'
import ValuesByDocument from 'hooks/ValuesByDocument'
import DrawNuevoCiente from 'Modales/DrawNuevoCiente'
import edit from 'assets/icons/edit.svg'

const ClientDetail = (props) => {

  const [isOpen, setIsOpen] = useState(false)
  
  const [current, send] = useMachine(ClienteDetailContext)
  useEffect(() => {
    send('LOAD_CLIENTE', { id: props.match.params.id })
  }, [props])
  
  const { cliente } = current.context

  const history = useHistory()
  const handledDetail = (lote, idProject) => {
    history.push({
      pathname: `/detalle/lote/${lote.lote}/cliente/${cliente.nombre}/projecto/${idProject}`,
      state: [lote]
    })
  }

  return (
  <>
    <Container maxW="container.lg">
      <Box mt={5} mb={3} maxW="100%" minH="10rem">
        <Heading mb={4}>
          { current.matches('success') && cliente.nombre }
          { current.matches('loadCliente') && <Spinner /> }
          <Button
            colorScheme="teal"
            variant="link"
            style={{ marginLeft: '30px', width: '40px' }}
            onClick={() => setIsOpen(true)}
            >
            <img src={edit} style={{ width: '30px' }} />
          </Button>
        </Heading>
        <Text fontSize="xl">
          Selecciona alguno de los lotes para ver pagos pendientes
        </Text>
      </Box>
      <Table variant="striped" colorScheme="teal" className='bg_esmeralda'>
        <TableCaption></TableCaption>
        <Thead>
          <Tr>
            <Th>Proyecto</Th>
            <Th>Lote</Th>
            <Th>Manzana</Th>
            <Th>Inicio de Contrato</Th>
            <Th>Mensualidad</Th>
            <Th>Plazo</Th>
            <Th>Precio Total</Th>
          </Tr>
        </Thead>
        <Tbody>
          {
            current.matches('success') && Object
              .values(cliente.lotes)
              .map((lote) => {
                console.log({ lote })
                const [idProject] = lote?.proyecto
                const proyectName = <ValuesByDocument id={ idProject } documentType="Proyecto" cbValue='title' />
                return (
                  <Tr style={{ pointer: 'cursor' }} key={lote?._id} onClick={() => handledDetail(lote, idProject)}>
                    <Td>{ proyectName }</Td>
                    <Td>{ lote?.lote }</Td>
                    <Td>{ lote?.manzana }</Td>
                    <Td>{ lote?.inicioContrato && <DateIntlForma date={lote?.inicioContrato } />}</Td>
                    <Td><NumberFormat number={ lote?.mensualidad} /></Td>
                    <Td>{ lote?.plazo}</Td>
                    <Td><NumberFormat number={ lote?.precioTotal} /></Td>
                  </Tr>
                )
              })
          }
          {
             current.matches('loadCliente') && <Spinner />
          }
          {
            current.matches('success') &&
              Object.values(cliente.lotes).length === 0 &&
              <Text fontSize="xl">No hay lotes registrados</Text>
          }
        </Tbody>
      </Table>
      <Stack direction="row" h="100px" p={4}>
        <Divider orientation="vertical" />
        <Text>Chakra UI</Text>
      </Stack>
    </Container>
    {
      current.matches('success') &&
      <DrawNuevoCiente
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        data={cliente}
      />
    }
  </>
  )
}

export default ClientDetail
