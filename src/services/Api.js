import axios from 'axios'

const Api = axios.create({
  baseURL: process.env.REACT_APP_API_URL + '/api/',
  headers: {
    'Content-Type': 'application/json'
  }
})

Api.interceptors.request.use(async (config) => {
  const userToken = await JSON.parse(window.localStorage.getItem('token'))
  config.headers.Authorization = `token ${userToken}`
  return config
}, (error) => {
  // I cand handle a request with errors here
  return Promise.reject(error)
})

Api.interceptors.response.use(config => {
  return config
}, error => {
  if (error.response.status === 401 && window.localStorage.getItem('user') !== null) {
    window.localStorage.clear()
    window.location.reload()
  }
})

export default Api
