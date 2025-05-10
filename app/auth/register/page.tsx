import { RegisterForm } from "@/components/register-form"

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto">
      <div className="glass-card p-8">
        <h1 className="text-2xl font-bold mb-6 text-white text-center">Register</h1>
        <RegisterForm />
      </div>
    </div>
  )
}

