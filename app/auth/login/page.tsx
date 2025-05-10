import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto">
      <div className="glass-card p-8">
        <h1 className="text-2xl font-bold mb-6 text-white text-center">Login</h1>
        <LoginForm />
      </div>
    </div>
  )
}

