"use client"

export function isLoggedIn(): boolean {
  return document.cookie.includes("jwt_token")
}

export function subscribeToAuthChanges(callback: (isAuthenticated: boolean) => void) {
  const checkAuth = () => {
    callback(isLoggedIn())
  }

  // Check immediately
  checkAuth()

  // Create a custom event for auth changes
  const authChangeEvent = "authStateChanged"
  window.addEventListener(authChangeEvent, checkAuth)

  return () => {
    window.removeEventListener(authChangeEvent, checkAuth)
  }
}

export function notifyAuthChange() {
  window.dispatchEvent(new Event("authStateChanged"))
}

