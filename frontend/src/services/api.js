import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 120000,
})

export async function analyzeMri(file) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post('/predict', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

