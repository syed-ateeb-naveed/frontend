"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { registerDonor } from "@/app/actions"

export function DonorRegistrationForm() {
  const [bloodGroup, setBloodGroup] = useState("")
  const [gender, setGender] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    const formData = new FormData(e.currentTarget)
    formData.append("blood_group", bloodGroup)
    formData.append("gender", gender)
    const result = await registerDonor(formData)
    if (result.success) {
      router.push("/blood/profile")
    } else {
      setError(result.error || "Donor registration failed")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="blood_group">Blood Group</Label>
        <div className="text-black">
          <Select onValueChange={setBloodGroup} required>
            <SelectTrigger>
              <SelectValue placeholder="Select blood group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A-">A-</SelectItem>
              <SelectItem value="B+">B+</SelectItem>
              <SelectItem value="B-">B-</SelectItem>
              <SelectItem value="AB+">AB+</SelectItem>
              <SelectItem value="AB-">AB-</SelectItem>
              <SelectItem value="O+">O+</SelectItem>
              <SelectItem value="O-">O-</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="gender">Gender</Label>
        <div className="text-black">
          <Select onValueChange={setGender} required>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="height">Height (cm)</Label>
        <Input id="height" name="height" type="number" required className="text-black" />
      </div>
      <div>
        <Label htmlFor="weight">Weight (kg)</Label>
        <Input id="weight" name="weight" type="number" required className="text-black" />
      </div>
      <div>
        <Label htmlFor="ailments">Ailments</Label>
        <Input id="ailments" name="ailments" type="text" required className="text-black" />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" className="w-full">
        Register as Donor
      </Button>
    </form>
  )
}

