'use client'

import { useEffect, useState } from 'react'
import { AuthUser, AdminUser, getCurrentUser, getAdminUser, onAuthStateChange } from '@/lib/auth'

export interface UseAuthResult {
  user: AuthUser | null
  admin: AdminUser | null
  loading: boolean
  isAdmin: boolean
}

/**
 * Custom hook for authentication state
 */
export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check current session on mount
    const checkAuth = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)

      if (currentUser) {
        const adminUser = await getAdminUser()
        setAdmin(adminUser)
      }

      setLoading(false)
    }

    checkAuth()

    // Listen to auth changes
    const unsubscribe = onAuthStateChange(async currentUser => {
      setUser(currentUser)

      if (currentUser) {
        const adminUser = await getAdminUser()
        setAdmin(adminUser)
      } else {
        setAdmin(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return {
    user,
    admin,
    loading,
    isAdmin: !!admin,
  }
}
