import React from 'react'
import { Provider } from 'react-redux'
import { store } from './Redux/store'

export default function Root (props) {
  return <Provider store={store}>
    {props.children}
  </Provider>
}
