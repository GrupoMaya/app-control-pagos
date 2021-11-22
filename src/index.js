import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { ChakraProvider } from '@chakra-ui/react'
import themeContext from 'utils/themeContext'

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={themeContext}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
