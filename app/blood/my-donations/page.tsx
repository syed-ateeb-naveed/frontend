"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Check, X, Pause, Play, Droplet, Calendar, Clock, MapPin, Hash } from "lucide-react"
import { useRouter } from "next/navigation"
import { getDonations } from "@/app/actions"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Add this line to force dynamic rendering
export const dynamic = "force-dynamic"

export default function MyDonationsPage() {
  const router = useRouter()
  const [donations, setDonations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setIsLoading(true)
        const data = await getDonations()
        setDonations(data || [])
      } catch (error) {
        console.error("Error fetching donations:", error)
        setDonations([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchDonations()
  }, [])

  const formatLocation = (location: any) => {
    if (!location) return "Not specified"
    return location.name
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <Pause className="w-6 h-6" />
      case "scheduled":
        return <Play className="w-6 h-6" />
      case "completed":
        return <Check className="w-6 h-6" />
      case "cancelled":
        return <X className="w-6 h-6" />
      default:
        return <Hash className="w-6 h-6" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-500"
      case "scheduled":
        return "bg-blue-500"
      case "completed":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">My Donations</h1>
          <Button onClick={() => router.push("/blood/donations/new")} className="bg-red-500 hover:bg-red-600">
            <Plus className="w-4 h-4 mr-2" />
            Schedule Donation
          </Button>
        </div>
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
        <h1 className="text-3xl font-bold text-white">My Donations</h1>
        <Button onClick={() => router.push("/blood/donations/new")} className="bg-red-500 hover:bg-red-600">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Donation
        </Button>
      </div>

      <div className="space-y-6">
        {donations.length === 0 ? (
          <Card className="glass-card bg-white/20">
            <CardContent className="p-8 text-center text-white">
              <p>You haven't made any donations yet.</p>
            </CardContent>
          </Card>
        ) : (
          donations.map((donation) => (
            <Card key={donation.id} className="glass-card bg-white/20 hover:bg-white/30 transition-colors">
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
                      <Droplet className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-300">
                        {donation.units > 1 ? "Blood Units" : "Blood Unit"}
                      </p>
                      <p className="text-lg font-semibold">{donation.units} {donation.units > 1 ? "units" : "unit"}</p>
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
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a
                              href={donation.location?.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-lg font-semibold hover:text-red-400 transition-colors"
                            >
                              {formatLocation(donation.location)}
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{donation.location?.address}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-white">
                      <div className="p-3 bg-red-500/20 rounded-full">
                        {getStatusIcon(donation.status)}
                      </div>
                      <div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge 
                                className={`text-base px-3 py-1 select-none ${getStatusColor(donation.status)}`}
                              >
                                {donation.status}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Status</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

