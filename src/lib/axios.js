import Axios from 'axios'

const axios = Axios.create({
  baseURL: 'https://codeaxion.com/api/v1',
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  },
  withXSRFToken: true,
  withCredentials: true
})

export default axios
