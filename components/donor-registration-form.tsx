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
  const [heightUnit, setHeightUnit] = useState("cm")
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const convertHeightToCm = (value: number, unit: string): number => {
    switch (unit) {
      case "cm":
        return value
      case "in":
        return value * 2.54
      case "ft":
        return value * 30.48
      default:
        return value
    }
  }

  const validateHeight = (value: number, unit: string): boolean => {
    const cmValue = convertHeightToCm(value, unit)
    return cmValue >= 100 && cmValue <= 250 // 100cm to 250cm (3.3ft to 8.2ft)
  }

  const validateWeight = (value: number): boolean => {
    return value >= 30 && value <= 200 // 30kg to 200kg (66lbs to 440lbs)
  }

  const getHeightError = (value: string, unit: string): string | null => {
    if (!value) return null
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return "Please enter a valid number"
    
    const cmValue = convertHeightToCm(numValue, unit)
    if (cmValue < 100) return `Height too short (minimum ${unit === "cm" ? "100cm" : unit === "in" ? "39.4in" : "3.3ft"})`
    if (cmValue > 250) return `Height too tall (maximum ${unit === "cm" ? "250cm" : unit === "in" ? "98.4in" : "8.2ft"})`
    return null
  }

  const getWeightError = (value: string): string | null => {
    if (!value) return null
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return "Please enter a valid number"
    if (numValue < 30) return "Weight too low (minimum 30kg)"
    if (numValue > 200) return "Weight too high (maximum 200kg)"
    return null
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    const formData = new FormData(e.currentTarget)
    const heightValue = parseFloat(height)
    const weightValue = parseFloat(weight)

    // Validate height and weight
    if (!validateHeight(heightValue, heightUnit)) {
      setError("Please enter a valid height")
      return
    }

    if (!validateWeight(weightValue)) {
      setError("Please enter a valid weight")
      return
    }

    // Convert height to cm
    const heightInCm = convertHeightToCm(heightValue, heightUnit)

    // Prepare form data
    formData.set("height", heightInCm.toString())
    formData.append("blood_group", bloodGroup)
    formData.append("gender", gender)

    const result = await registerDonor(formData)
    if (result.success) {
      router.push("/blood/profile")
    } else {
      setError(result.error || "Donor registration failed")
    }
  }

  const heightError = getHeightError(height, heightUnit)
  const weightError = getWeightError(weight)

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
      <div className="space-y-2">
        <Label htmlFor="height">Height</Label>
        <div className="flex gap-2">
          <Input 
            id="height" 
            name="height" 
            type="number" 
            required 
            className={`text-black ${heightError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            placeholder="Enter height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
          <Select value={heightUnit} onValueChange={setHeightUnit}>
            <SelectTrigger className="w-[100px] text-black">
              <SelectValue placeholder="Unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cm">cm</SelectItem>
              <SelectItem value="in">inches</SelectItem>
              <SelectItem value="ft">feet</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {heightError && <p className="text-sm text-red-500">{heightError}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="weight">Weight (kg)</Label>
        <Input 
          id="weight" 
          name="weight" 
          type="number" 
          required 
          className={`text-black ${weightError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          placeholder="Enter weight in kg"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        {weightError && <p className="text-sm text-red-500">{weightError}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="ailments">Ailments</Label>
        <Input 
          id="ailments" 
          name="ailments" 
          type="text" 
          required 
          className="text-black" 
          placeholder="Enter your ailments or type 'N/A' if none"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button 
        type="submit" 
        className="w-full"
        disabled={!!heightError || !!weightError}
      >
        Register as Donor
      </Button>
    </form>
  )
}

