"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { login } from "@/lib/auth"
import { motion } from "framer-motion"
import { Loader2, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simple validation
    if (!email || !password) {
      setError("Please enter both email and password")
      setIsLoading(false)
      return
    }

    // Simulate network delay
    setTimeout(() => {
      // Attempt login
      const success = login(email, password)

      if (success) {
        toast({
          title: "Login successful!",
          description: "Welcome to LinkSaver.",
        })
        router.push("/dashboard")
      } else {
        setError("Invalid credentials. Try demo@test.com / password123")
        setIsLoading(false)
      }
    }, 1000)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden border-slate-200 shadow-lg dark:border-slate-700">
        <CardHeader className="bg-white pb-4 dark:bg-slate-800">
          <CardTitle className="text-center text-xl">Sign In</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="demo@test.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-slate-200 dark:border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="password123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-slate-200 dark:border-slate-700"
              />
            </div>
            {error && (
              <div className="flex items-center rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-300">
                <AlertCircle className="mr-2 h-4 w-4" />
                {error}
              </div>
            )}
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Demo credentials: demo@test.com / password123
            </div>
          </CardContent>
          <CardFooter className="bg-slate-50 dark:bg-slate-800/50">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  )
}
