"use client"

import { WorkerLoginForm } from "@/components/worker-login-form"

export default function WorkerLoginPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="glass-card p-8">
          <h1 className="text-2xl font-bold mb-6 text-white text-center">Worker Login</h1>
          <WorkerLoginForm />
        </div>
      </div>
    </div>
  )
} 