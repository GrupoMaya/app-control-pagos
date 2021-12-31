import React, { memo, useEffect } from 'react'
import { useMachine } from '@xstate/react'
import ClienteDetailContext from 'context/ClienteDetailContext'
import {
  Container,
  Box,
  Heading,
  Text,
  Stack,
  Divider,
  Spinner
} from '@chakra-ui/react'
import TablaMorosos from 'Components/Morosos/TablaMorosos'

const Morosos = (props) => {
  
  const [current, send] = useMachine(ClienteDetailContext)

  useEffect(() => {
    send('GET_MOROSOS')
  }, [props])
  
  const { morosos } = current.context

  return (
  <>
    <Container maxW="container.lg">
      <Box mt={3} mb={3} maxW="100%" minH="10rem">
        <Heading mb={4}>
        </Heading>
        <Text fontSize="xl">
          Lista de Clientes Morosos, 30 días y más de 60 dias, desde su último pago
          <Divider orientation="vertical" />
          <Text>Selecciona una fila para ir a la pantalla de pagos.</Text>
        </Text>
      </Box>
      {/* 30 dias */}
      {
          current.matches('loadMorosos') && (
            <>
              <Spinner />
              <Text sx={{ fontSize: '28px' }}>Cargando listas...</Text>
            </>
          )
      }
      {
        current.matches('success') &&
        <TablaMorosos
          data={morosos}
          current={current}
          key_data='treinta_dias'
          title='Clientes con mas de 30 días de su ultimo pago'
        />
      }
      <Stack direction="row" h="100px" p={4}>
        <Divider orientation="vertical" />
        {/* <Text>Chakra UI</Text> */}
      </Stack>
      {/* 60 dias */}
            {
        current.matches('success') &&
        <TablaMorosos
          data={morosos}
          current={current}
          key_data='sesenta_dias'
          title='Clientes con mas de 60 días de su ultimo pago'
        />
      }
    </Container>
  </>
  )
}

export default memo(Morosos)
