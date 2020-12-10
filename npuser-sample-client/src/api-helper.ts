import axios from 'axios'
import { AxiosRequestConfig, AxiosResponse, AxiosError} from "axios"
import qs from 'qs'

export default class ApiHelper {
  private readonly apiUrl: String
  constructor (apiUrl: String) {
    this.apiUrl = apiUrl
  }

  submitEmail (email: String): Promise<string> {
    const apiUrl = this.apiUrl
    const url = `${apiUrl}/sendAuth`
    const options: AxiosRequestConfig = {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify({email}),
      url,
    }
    type Auth = {
      token: string;
    }
    return axios(options).then((response: AxiosResponse<Auth>) => {
      const { data } = response;
      console.log('What is in the response', response, data)
      return data.token
    })
  }

  demoLogout (token: String) {
    const apiUrl = this.apiUrl
    const url = `${apiUrl}/demo/logout`
    return axios.post(url)
    .catch((err: AxiosError) => {
      console.log('demoHelper error', err)
    })
  }

}
