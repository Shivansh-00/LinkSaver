import { redirect } from "next/navigation"
import LoginForm from "@/components/login-form"
import { isAuthenticated } from "@/lib/auth"

export default function Home() {
  // If user is already authenticated, redirect to dashboard
  if (typeof window !== "undefined" && isAuthenticated()) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            <span className="text-blue-600 dark:text-blue-400">Link</span>Saver
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Save and auto-summarize your favorite links</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
