import axios from 'axios'
import { getAuthToken } from '@/user'

export const npAxios = axios.create({
  validateStatus: function (status: number) {
    // console.log('np axios axios validating status', status)
    // return status >= 200 && status < 300; // default
    return status >= 200 && status < 500; // custom. Will handle 400 errors in code differently than a 500 error
  }
});

npAxios.interceptors.request.use(function (config) {
  delete config.headers['Authorization']
  const token = getAuthToken()
  console.log('np axios auth token', token)
  if (token && token.length > 0) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});
