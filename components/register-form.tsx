"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { registerUser } from "@/app/actions"

export function RegisterForm() {
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    const formData = new FormData(e.currentTarget)
    const result = await registerUser(formData)
    if (result.success) {
      router.push("/auth/login")
    } else {
      setError(result.error || "Registration failed")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white">
          Email
        </Label>
        <Input id="email" name="email" type="email" required className="input-field" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-white">
          Password
        </Label>
        <Input id="password" name="password" type="password" required className="input-field" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="first_name" className="text-white">
          First Name
        </Label>
        <Input id="first_name" name="first_name" type="text" required className="input-field" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="last_name" className="text-white">
          Last Name
        </Label>
        <Input id="last_name" name="last_name" type="text" required className="input-field" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="date_of_birth" className="text-white">
          Date of Birth
        </Label>
        <Input id="date_of_birth" name="date_of_birth" type="date" required className="input-field" />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <Button type="submit" className="w-full button-primary">
        Register
      </Button>
    </form>
  )
}

