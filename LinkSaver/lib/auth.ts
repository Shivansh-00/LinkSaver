// Hard-coded demo credentials
const DEMO_EMAIL = "demo@test.com"
const DEMO_PASSWORD = "password123"
const AUTH_TOKEN_KEY = "auth_token"

// Login function
export const login = (email: string, password: string): boolean => {
  // Check if credentials match demo credentials
  if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
    // Generate a simple token (in a real app, this would be JWT)
    const token = btoa(`${email}:${Date.now()}`)

    // Store token in localStorage
    localStorage.setItem(AUTH_TOKEN_KEY, token)

    return true
  }

  return false
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false

  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  return !!token
}

// Logout function
export const logout = (): void => {
  if (typeof window === "undefined") return

  localStorage.removeItem(AUTH_TOKEN_KEY)
}
