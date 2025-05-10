import { redirect } from "next/navigation"

export default function AuthPage() {
  // Redirect to login page instead of using a function component
  redirect("/auth/login")
}

