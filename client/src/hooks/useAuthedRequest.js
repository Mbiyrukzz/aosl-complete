import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { useUser } from './useUser'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export const useAuthedRequest = () => {
  const { token } = useUser()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(Boolean(token))
  }, [token])

  const request = useCallback(
    async (method, url, body = null, config = {}) => {
      if (!token) throw new Error('No auth token available')

      const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`
      const isFormData = body instanceof FormData

      // Build headers — Authorization always; let axios handle Content-Type for FormData
      const headers = {
        Authorization: `Bearer ${token}`,
        ...(config.headers || {}),
      }

      // Don't let anyone set Content-Type for FormData — axios needs to set the boundary
      if (isFormData) {
        delete headers['Content-Type']
        delete headers['content-type']
      }

      const response = await axios({
        method,
        url: fullUrl,
        data: body,
        ...config,
        headers, // headers last so they're not overridden by ...config
      })

      return response.data
    },
    [token],
  )

  const get = useCallback(
    (url, config) => request('get', url, null, config),
    [request],
  )
  const post = useCallback(
    (url, body, config) => request('post', url, body, config),
    [request],
  )
  const put = useCallback(
    (url, body, config) => request('put', url, body, config),
    [request],
  )
  const patch = useCallback(
    (url, body, config) => request('patch', url, body, config),
    [request],
  )
  const del = useCallback(
    (url, config) => request('delete', url, null, config),
    [request],
  )

  return { isReady, get, post, put, patch, del }
}

export default useAuthedRequest
