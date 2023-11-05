import { userModuleName } from './constants/actions'

export const getPreviouslyKnownWords = (state) => {
  const { previouslyKnownWords } = state[userModuleName]
  return previouslyKnownWords || []
}

export const getCurrectUserId = (state) => {
  const { currentUserId } = state[userModuleName]
  return currentUserId
}

export const getCurrectUserSelectedLevel = (state) => {
  const { selectedLevel } = state[userModuleName]
  return selectedLevel
}

export const getCurrectUserEmail = (state) => {
  const { email } = state[userModuleName]
  return email
}

export const getIsAuthorized = (state) => {
  const { isAuthorized } = state[userModuleName]
  return isAuthorized
}
