import thunk from 'redux-thunk'
import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import { learningHistoryModuleName } from './LearningHistory/constants/actions.js'
import learningHistoryReducer from './LearningHistory/reducer'
import { userModuleName } from './User/constants/actions.js'
import userReducer from './User/reducer'
import { contextModuleName } from './Context/constants/actions.js'
import contextReducer from './Context/reducer'
import wordReducer from './Word/reducer'
import videoReducer from './Video/reducer'
import { wordModuleName } from './Word/constants/actions.js'
import { videoModuleName } from './Video/constants/actions.js'

export const rootReducer = combineReducers({
  [learningHistoryModuleName]: learningHistoryReducer,
  [userModuleName]: userReducer,
  [contextModuleName]: contextReducer,
  [wordModuleName]: wordReducer,
  [videoModuleName]: videoReducer
})

export const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
  )
)
