"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { getWorkerDonations, getWorkerDonationDetails, getWorkerDonationsByStatus } from "@/app/actions"
import { Badge } from "@/components/ui/badge"
import { Hash, Calendar, Clock, MapPin, Activity } from "lucide-react"
import { format } from "date-fns"
import DonationDetailsModal from "@/app/components/DonationDetailsModal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function WorkerDonationsPage() {
  const [donations, setDonations] = useState<any[]>([])
  const [selectedDonation, setSelectedDonation] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setIsLoading(true)
        const data = selectedStatus === "all" 
          ? await getWorkerDonations()
          : await getWorkerDonationsByStatus(selectedStatus)
        setDonations(data || [])
      } catch (error) {
        console.error("Error fetching donations:", error)
        setDonations([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchDonations()
  }, [selectedStatus])

  const handleDonationClick = async (donationId: number) => {
    try {
      const details = await getWorkerDonationDetails(donationId)
      if (details) {
        setSelectedDonation(details)
        setIsModalOpen(true)
      }
    } catch (error) {
      console.error("Error fetching donation details:", error)
    }
  }

  const handleStatusUpdate = () => {
    // Refresh the donations list
    const fetchDonations = async () => {
      try {
        setIsLoading(true)
        const data = selectedStatus === "all" 
          ? await getWorkerDonations()
          : await getWorkerDonationsByStatus(selectedStatus)
        setDonations(data || [])
      } catch (error) {
        console.error("Error fetching donations:", error)
        setDonations([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchDonations()
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-500"
      case "approved":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      case "completed":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatLocation = (location: any) => {
    if (!location) return "Not specified"
    return location.name
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">All Donations</h1>
        <Card className="glass-card bg-white/20">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">All Donations</h1>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px] bg-white/20 text-white border-white/20">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Donations</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        {donations.length === 0 ? (
          <Card className="glass-card bg-white/20">
            <CardContent className="p-8 text-center text-white">
              <p>No donations found.</p>
            </CardContent>
          </Card>
        ) : (
          donations.map((donation) => (
            <Card 
              key={donation.id} 
              className="glass-card bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
              onClick={() => handleDonationClick(donation.id)}
            >
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  <div className="flex items-center space-x-4 text-white">
                    <div className="p-3 bg-red-500/20 rounded-full">
                      <Hash className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-300">Donation ID</p>
                      <p className="text-lg font-semibold">{donation.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-white">
                    <div className="p-3 bg-red-500/20 rounded-full">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-300">Units</p>
                      <p className="text-lg font-semibold">{donation.units} units</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-white">
                    <div className="p-3 bg-red-500/20 rounded-full">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-300">Date</p>
                      <p className="text-lg font-semibold">
                        {donation.date ? format(new Date(donation.date), "MMM dd, yyyy") : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-white">
                    <div className="p-3 bg-red-500/20 rounded-full">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-300">Time</p>
                      <p className="text-lg font-semibold">{donation.time || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-white">
                    <div className="p-3 bg-red-500/20 rounded-full">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-300">Location</p>
                      <p className="text-lg font-semibold">{formatLocation(donation.location)}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-white">
                      <div className="p-3 bg-red-500/20 rounded-full">
                        <Activity className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-300">Status</p>
                        <Badge className={getStatusColor(donation.status)}>
                          {donation.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <DonationDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        donation={selectedDonation}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  )
} 