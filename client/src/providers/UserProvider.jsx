import { useEffect, useState } from 'react'
import { onIdTokenChanged } from 'firebase/auth'
import { auth } from '../services/firebase'
import { UserContext } from '../contexts/UserContext'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        try {
          const freshToken = await firebaseUser.getIdToken()
          setToken(freshToken)

          const res = await fetch(`${API_BASE}/api/users/me`, {
            headers: { Authorization: `Bearer ${freshToken}` },
          })

          if (res.ok) {
            const data = await res.json()

            setProfile(data.user ?? data)
          }
        } catch (err) {
          console.error('Failed to load profile:', err)
        }
      } else {
        setToken(null)
        setProfile(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  return (
    <UserContext.Provider value={{ user, profile, token, loading }}>
      {children}
    </UserContext.Provider>
  )
}
