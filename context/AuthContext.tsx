'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { auth } from '@/lib/api'

interface User {
  _id: string
  username: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token')
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const userData = await auth.getMe()
      setUser(userData)
    } catch (err) {
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setError(null)
      const data = await auth.login({ email, password })
      localStorage.setItem('token', data.token)
      setUser({
        _id: data._id,
        username: data.username,
        email: data.email,
      })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
      throw err
    }
  }

  const register = async (username: string, email: string, password: string) => {
    try {
      setError(null)
      const data = await auth.register({ username, email, password })
      localStorage.setItem('token', data.token)
      setUser({
        _id: data._id,
        username: data.username,
        email: data.email,
      })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed')
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        error, 
        isAuthenticated: !!user,
        isLoading: loading,
        login, 
        register, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 