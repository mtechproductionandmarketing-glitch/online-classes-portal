import { supabase } from './supabase'

export interface AuthUser {
  id: string
  email: string
  role?: string
}

export interface AdminUser {
  id: string
  email: string
  role: string
  created_at: string
  last_login_at: string | null
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return null
    }

    return {
      id: user.id,
      email: user.email || '',
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return false
    }

    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (error || !data) {
      return false
    }

    return true
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

/**
 * Get admin user details
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return null
    }

    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error || !data) {
      return null
    }

    return data as AdminUser
  } catch (error) {
    console.error('Error getting admin user:', error)
    return null
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: 'Sign in failed. Please try again.',
    }
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: 'Sign out failed. Please try again.',
    }
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(
  callback: (user: AuthUser | null) => void
): () => void {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email || '',
      })
    } else {
      callback(null)
    }
  })

  return () => {
    data?.subscription?.unsubscribe()
  }
}

/**
 * Check if user session is still valid
 */
export async function isSessionValid(): Promise<boolean> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    return !!session
  } catch (error) {
    return false
  }
}

/**
 * Refresh session
 */
export async function refreshSession(): Promise<boolean> {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.refreshSession()

    return !!session && !error
  } catch (error) {
    return false
  }
}

/**
 * Get session details
 */
export async function getSessionDetails() {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    return session
  } catch (error) {
    return null
  }
}

/**
 * Update admin last login
 */
export async function updateAdminLastLogin(adminId: string): Promise<void> {
  try {
    await supabase.rpc('update_admin_last_login', {
      admin_id: adminId,
    })
  } catch (error) {
    console.error('Error updating last login:', error)
  }
}
