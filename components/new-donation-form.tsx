"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createDonation, getDonor, getLocations } from "@/app/actions"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { ExternalLink } from "lucide-react"

interface Location {
  id: number
  name: string
  address: string
  type: string
  link: string
}

export function NewDonationForm() {
  const [error, setError] = useState("")
  const [donorId, setDonorId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [locations, setLocations] = useState<Location[]>([])
  const [units, setUnits] = useState("")
  const [isLocationsModalOpen, setIsLocationsModalOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      const [donor, locationsData] = await Promise.all([
        getDonor(),
        getLocations()
      ])
      
      if (donor && donor.id) {
        setDonorId(donor.id)
      } else {
        setError("Failed to fetch donor ID, register as a Donor first")
      }

      if (locationsData) {
        setLocations(locationsData)
      }
    }
    fetchData()
  }, [])

  const validateUnits = (value: string): string | null => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return "Please enter a valid number"
    if (numValue < 1) return "Minimum 1 unit required"
    if (numValue > 2) return "Maximum 2 units allowed"
    return null
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    const unitsError = validateUnits(units)
    if (unitsError) {
      setError(unitsError)
      setIsSubmitting(false)
      return
    }

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
    <>
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
          <Input 
            id="units" 
            name="units" 
            type="number" 
            min="1" 
            max="2"
            required 
            className={`text-black ${validateUnits(units) ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            value={units}
            onChange={(e) => setUnits(e.target.value)}
          />
          {validateUnits(units) && (
            <p className="text-sm text-red-500">{validateUnits(units)}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Select name="location" required>
            <SelectTrigger className="text-black">
              <SelectValue placeholder="Select a location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id.toString()}>
                  {location.name} - {location.address}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            type="button"
            onClick={() => setIsLocationsModalOpen(true)}
            className="text-sm text-blue-400 hover:text-blue-300 underline"
          >
            View all locations
          </button>
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
          <Button 
            type="submit" 
            disabled={isSubmitting || !!validateUnits(units)}
          >
            {isSubmitting ? "Submitting..." : "Schedule Donation"}
          </Button>
        </div>
      </form>

      <Transition appear show={isLocationsModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsLocationsModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-gray-900 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-white mb-4"
                  >
                    All Locations
                  </Dialog.Title>

                  <div className="mt-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="px-4 py-2 text-white">Name</th>
                            <th className="px-4 py-2 text-white">Address</th>
                            <th className="px-4 py-2 text-white">Type</th>
                            <th className="px-4 py-2 text-white">Map</th>
                          </tr>
                        </thead>
                        <tbody>
                          {locations.map((location) => (
                            <tr key={location.id} className="border-b border-gray-700">
                              <td className="px-4 py-2 text-white">{location.name}</td>
                              <td className="px-4 py-2 text-gray-300">{location.address}</td>
                              <td className="px-4 py-2 text-gray-300 capitalize">{location.type}</td>
                              <td className="px-4 py-2">
                                <a
                                  href={location.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                >
                                  View Map <ExternalLink className="w-4 h-4" />
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      className="bg-gray-700 text-white hover:bg-gray-600"
                      onClick={() => setIsLocationsModalOpen(false)}
                    >
                      Close
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

