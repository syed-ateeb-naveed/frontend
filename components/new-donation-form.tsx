"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createDonation, getDonor } from "@/app/actions"

export function NewDonationForm() {
  const [error, setError] = useState("")
  const [donorId, setDonorId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function fetchDonorId() {
      const donor = await getDonor()
      if (donor && donor.id) {
        setDonorId(donor.id)
      } else {
        setError("Failed to fetch donor ID, register as a Donor first")
      }
    }
    fetchDonorId()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    if (donorId) {
      formData.append("donorId", donorId)
      const result = await createDonation(formData)
      if (result.success) {
        router.push("/blood/my-donations")
      } else {
        setError(result.error || "Failed to create donation")
      }
    } else {
      setError("Donor ID is not available, register as a Donor first")
    }
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input id="date" name="date" type="date" required className="text-black" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="time">Time</Label>
        <Input id="time" name="time" type="time" required className="text-black" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="units">Units</Label>
        <Input id="units" name="units" type="number" min="1" required className="text-black" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input id="location" name="location" type="text" required className="text-black" />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/blood/my-donations")}
          className="text-black"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Schedule Donation"}
      </Button>
      </div>
    </form>
  )
}

