// frontend/src/services/api.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3001', // http://backend:3001
})
