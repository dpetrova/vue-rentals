import axios from 'axios'
import https from 'https'

const cfg = require('../globals')

const instance = axios.create({
  baseURL: cfg.API_URL,
  withCredentials: false,
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

export default instance
