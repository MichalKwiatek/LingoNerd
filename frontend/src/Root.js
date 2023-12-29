import React from 'react'
import { Provider } from 'react-redux'
import { store } from './Redux/store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function Root(props) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
    </Provider>
  )
}
