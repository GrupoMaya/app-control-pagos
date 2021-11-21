import { useEffect, memo } from 'react'
import ClienteDetailContext from 'context/ClienteDetailContext'
import { useMachine } from '@xstate/react'
import { Spinner } from '@chakra-ui/react'

const ValuesByDocument = ({ id, documentType, cbValue }) => {

  const [current, send] = useMachine(ClienteDetailContext)

  /**
   * @constructor
   * @params { string } id - Object id del documento
   * @params { string } documentType - Proyecto, Lotes, Clientes, Pagos
   * @params { string } cbValue - Valor del documentos (mongo) que queremos ver
   */

  useEffect(() => {
    send('GET_DOCUMENT_VALUES', { id, documentType, cbValue })
  }, [id])

  const { documentValues } = current.context

  const returnValue = current.matches('success') && Object
    .entries(documentValues)
    .map(([key]) => key === cbValue && documentValues[key])

  return current.matches('success') ? returnValue : <Spinner />

}

export default memo(ValuesByDocument)
