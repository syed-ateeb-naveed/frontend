"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { createBloodRequest } from "@/app/actions"

const bloodTypes = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
]

export default function NewBloodRequestPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    blood_type: "",
    units_required: "",
    request_date: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formDataObj = new FormData()
    formDataObj.append("blood_type", formData.blood_type)
    formDataObj.append("units_required", formData.units_required)
    formDataObj.append("request_date", formData.request_date)

    const result = await createBloodRequest(formDataObj)

    if (result.success) {
      toast.success("Blood request created successfully")
      router.push("/blood/my-requests")
    } else {
      toast.error(result.error || "Failed to create blood request")
    }
    
    setIsSubmitting(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">New Blood Request</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="blood_type">Blood Type</Label>
            <Select
              value={formData.blood_type}
              onValueChange={(value) =>
                setFormData({ ...formData, blood_type: value })
              }
            >
              <SelectTrigger className="text-black">
                <SelectValue placeholder="Select blood type" />
              </SelectTrigger>
              <SelectContent>
                {bloodTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="units_required">Units Required</Label>
            <Input
              id="units_required"
              type="number"
              min="1"
              value={formData.units_required}
              onChange={(e) =>
                setFormData({ ...formData, units_required: e.target.value })
              }
              className="text-black"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="request_date">Request Date</Label>
            <Input
              id="request_date"
              type="date"
              value={formData.request_date}
              onChange={(e) =>
                setFormData({ ...formData, request_date: e.target.value })
              }
              className="text-black"
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              className="text-black"
              type="button"
              variant="outline"
              onClick={() => router.push("/blood/my-requests")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 