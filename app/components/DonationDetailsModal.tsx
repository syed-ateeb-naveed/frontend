import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useState, useEffect } from "react"
import { updateDonationStatus, getLocations } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { MapPin } from "lucide-react"

interface Location {
  id: number
  name: string
  address: string
  type: string
  link: string
}

interface Donation {
  id: number
  donor: {
    user: {
      first_name: string
      last_name: string
      email: string
    }
    blood_group: string
    gender: string
    height: number
    weight: number
    ailments: string
  }
  date: string
  time: string
  units: number
  location: {
    id: number
    name: string
    address: string
    type: string
    link: string
  }
  status: string
}

interface DonationDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  donation: Donation | null
  onStatusUpdate: () => void
}

export default function DonationDetailsModal({
  isOpen,
  onClose,
  donation,
  onStatusUpdate,
}: DonationDetailsModalProps) {
  const [cancelReason, setCancelReason] = useState("")
  const [showCancelInput, setShowCancelInput] = useState(false)
  const [showScheduleInput, setShowScheduleInput] = useState(false)
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchLocations = async () => {
      const data = await getLocations()
      setLocations(data)
      if (donation?.location) {
        const location = data.find((loc: Location) => loc.id === donation.location.id)
        if (location) {
          setSelectedLocation(location)
        }
      }
    }
    if (isOpen) {
      fetchLocations()
      if (donation?.date) {
        setScheduleDate(donation.date)
      }
      if (donation?.time) {
        setScheduleTime(donation.time)
      }
    }
  }, [isOpen, donation])

  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsLoading(true)
      let result

      if (newStatus === "cancelled") {
        if (!cancelReason) {
          toast.error("Please provide a reason for cancellation")
          return
        }
        result = await updateDonationStatus(donation.id, newStatus, cancelReason)
      } else if (newStatus === "scheduled") {
        if (!selectedLocation?.id) {
          toast.error("Please select a location")
          return
        }
        result = await updateDonationStatus(donation.id, newStatus, undefined, {
          date: scheduleDate,
          time: scheduleTime,
          location: selectedLocation.id
        })
      } else {
        result = await updateDonationStatus(donation.id, newStatus)
      }

      if (result.success) {
        toast.success("Status updated successfully")
        onStatusUpdate()
        onClose()
      } else {
        toast.error(result.error || "Failed to update status")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLocationClick = (link: string) => {
    window.open(link, '_blank')
  }

  const getStatusActions = () => {
    switch (donation?.status?.toLowerCase()) {
      case "pending":
        return (
          <div className="space-y-4">
            <Button
              onClick={() => setShowScheduleInput(true)}
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              Schedule Donation
            </Button>
            <Button
              onClick={() => setShowCancelInput(true)}
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              Cancel Donation
            </Button>
          </div>
        )
      case "scheduled":
        return (
          <div className="space-y-4">
            <Button
              onClick={() => handleStatusChange("completed")}
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              Mark as Completed
            </Button>
            <Button
              onClick={() => setShowCancelInput(true)}
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              Cancel Donation
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  if (!donation) return null

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
                  className="text-xl font-medium leading-6 text-white mb-6 text-center"
                >
                  Donation Details
                </Dialog.Title>

                <div className="grid grid-cols-2 gap-8">
                  {/* Left Column - Donor Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-white text-lg">Donor Information</h4>
                    <div className="space-y-2 text-gray-300">
                      <p><span className="font-semibold">Name:</span> {donation.donor?.user?.first_name} {donation.donor?.user?.last_name}</p>
                      <p><span className="font-semibold">Email:</span> {donation.donor?.user?.email}</p>
                      <p><span className="font-semibold">Blood Group:</span> {donation.donor?.blood_group}</p>
                      <p><span className="font-semibold">Gender:</span> {donation.donor?.gender}</p>
                      <p><span className="font-semibold">Height:</span> {donation.donor?.height} cm</p>
                      <p><span className="font-semibold">Weight:</span> {donation.donor?.weight} kg</p>
                      <p><span className="font-semibold">Ailments:</span> {donation.donor?.ailments}</p>
                    </div>
                  </div>

                  {/* Right Column - Donation Information and Actions */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-white text-lg">Donation Information</h4>
                    <div className="space-y-2 text-gray-300">
                      <p><span className="font-semibold">Units:</span> {donation.units}</p>
                      <p><span className="font-semibold">Date:</span> {donation.date}</p>
                      <p><span className="font-semibold">Time:</span> {donation.time}</p>
                      <p>
                        <span className="font-semibold">Location:</span>{" "}
                        {donation.location ? (
                          <span className="flex flex-col">
                            <span className="font-medium">{donation.location.name}</span>
                            <span className="text-sm text-gray-400">{donation.location.address}</span>
                            {donation.location.link && (
                              <button
                                onClick={() => handleLocationClick(donation.location.link)}
                                className="text-blue-400 hover:text-blue-300 text-sm mt-1 flex items-center gap-1"
                              >
                                <MapPin className="w-4 h-4" />
                                View on Map
                              </button>
                            )}
                          </span>
                        ) : (
                          "Not specified"
                        )}
                      </p>
                      <p><span className="font-semibold">Status:</span> {donation.status}</p>
                    </div>

                    {showCancelInput && (
                      <div className="mt-6 space-y-4">
                        <div>
                          <Label htmlFor="cancelReason" className="text-white">Reason for Cancellation</Label>
                          <Input
                            id="cancelReason"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            className="mt-1 bg-gray-800 text-white border-gray-700 focus:border-gray-600"
                            placeholder="Enter reason for cancellation"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleStatusChange("cancelled")}
                            className="flex-1 bg-red-600 hover:bg-red-700"
                            disabled={isLoading}
                          >
                            Confirm Cancellation
                          </Button>
                          <Button
                            onClick={() => {
                              setShowCancelInput(false)
                              setCancelReason("")
                            }}
                            className="flex-1 bg-gray-600 hover:bg-gray-700"
                            disabled={isLoading}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {showScheduleInput && (
                      <div className="mt-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="scheduleDate" className="text-white">Date</Label>
                            <Input
                              id="scheduleDate"
                              type="date"
                              value={scheduleDate}
                              onChange={(e) => setScheduleDate(e.target.value)}
                              className="mt-1 bg-gray-800 text-white border-gray-700 focus:border-gray-600"
                            />
                          </div>
                          <div>
                            <Label htmlFor="scheduleTime" className="text-white">Time</Label>
                            <Input
                              id="scheduleTime"
                              type="time"
                              value={scheduleTime}
                              onChange={(e) => setScheduleTime(e.target.value)}
                              className="mt-1 bg-gray-800 text-white border-gray-700 focus:border-gray-600"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="location" className="text-white">Location</Label>
                          <Select
                            value={selectedLocation?.id?.toString()}
                            onValueChange={(value) => {
                              const location = locations.find((loc: Location) => loc.id.toString() === value)
                              setSelectedLocation(location || null)
                            }}
                          >
                            <SelectTrigger className="mt-1 bg-gray-800 text-white border-gray-700 focus:border-gray-600">
                              <SelectValue placeholder="Select a location">
                                {selectedLocation && `${selectedLocation.name} - ${selectedLocation.address}`}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 text-white border-gray-700">
                              {locations.map((location) => (
                                <SelectItem 
                                  key={location.id} 
                                  value={location.id.toString()}
                                  className="focus:bg-gray-700"
                                >
                                  {`${location.name} - ${location.address}`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleStatusChange("scheduled")}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                            disabled={isLoading}
                          >
                            Confirm Schedule
                          </Button>
                          <Button
                            onClick={() => {
                              setShowScheduleInput(false)
                              setScheduleDate("")
                              setScheduleTime("")
                              setSelectedLocation(null)
                            }}
                            className="flex-1 bg-gray-600 hover:bg-gray-700"
                            disabled={isLoading}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {!showCancelInput && !showScheduleInput && (
                      <div className="mt-6">
                        {getStatusActions()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                    disabled={isLoading}
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
  )
} 