"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
      const checkAuth = () => {
        const hasToken = document.cookie.includes("jwt_token")
        setIsAuthenticated(hasToken)
        setIsLoading(false)
      }

      // Check immediately
      checkAuth()

      // Set up an interval to check periodically
      const interval = setInterval(checkAuth, 1000)

      return () => clearInterval(interval)
    } else {
      // Server-side rendering, set loading to false
      setIsLoading(false)
    }
  }, [])

  const login = () => {
    setIsAuthenticated(true)
  }

  const logout = async () => {
    setIsAuthenticated(false)
    router.push("/")
  }

  return <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

