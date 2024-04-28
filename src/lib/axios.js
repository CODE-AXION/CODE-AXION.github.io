import Axios from 'axios'

const axios = Axios.create({
  baseURL: 'https://codeaxion.com',
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  },
  withXSRFToken: true,
  withCredentials: true
})

export default axios
