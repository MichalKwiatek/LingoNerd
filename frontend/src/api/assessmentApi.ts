import { Auth } from 'aws-amplify'

const getApiUrl = (isAuthorized) => {
  return `https://kjtekzjnz6.execute-api.eu-central-1.amazonaws.com/prod${isAuthorized ? '' : '/public'}`
}

const getQueryUrl = (isAuthorized, path, queryParameters = {}) => {
  const allQueryParameters = isAuthorized
    ? queryParameters
    : { ...queryParameters, userId: localStorage.getItem('CURRENT_USER_ID') }

  const queryString = Object.keys(allQueryParameters)
    .map((key) => `${key}=${allQueryParameters[key]}`)
    .join('&')

  return `${getApiUrl(isAuthorized)}${path}?${queryString}`
}

async function getAuthorizationInfo() {
  try {
    const authorizationData = await Auth.currentSession()
    return { token: authorizationData.getIdToken().getJwtToken(), isAuthorized: true }
  } catch (error) {
    return { token: null, isAuthorized: false }
  }
}

export async function getAssessmentLevel(): Promise<{ level: number | null }> {
  const { token, isAuthorized } = await getAuthorizationInfo()

  const response = await fetch(getQueryUrl(isAuthorized, '/user/level'), {
    headers: isAuthorized ? { Authorization: token, 'Content-Type': 'application/json' } : {},
  })

  return response.json()
}

export async function getAmountOfLevels() {
  const { token, isAuthorized } = await getAuthorizationInfo()

  const response = await fetch(getQueryUrl(isAuthorized, '/levels/count'), {
    headers: isAuthorized ? { Authorization: token, 'Content-Type': 'application/json' } : {},
  })

  return response.json()
}
