import {npAxios} from '@/np-axios'

const URL = 'http://localhost:3000/'

export const postToMyServer = async function (apiUrl: string, payload: object) {
  const url = URL + apiUrl
  // console.log(`Auth post to ${url}`)
  return npAxios
    .post(url, payload)
    .then(response => { return response.data })
    .catch(error => {
      throw error
    })
}

export const getFromMyServer = async function (apiUrl: string) {
  const url = URL + apiUrl
  console.log(`App get to ${url}`)
  return npAxios
    .get(url)
    .then(response => { return response.data })
    .catch(error => {
      throw error
    })
}
