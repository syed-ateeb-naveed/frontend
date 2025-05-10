"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Pause, Play, Check, X, Droplet, Calendar, Hash } from "lucide-react"
import { useRouter } from "next/navigation"
import { getBloodRequests } from "@/app/actions"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface BloodRequest {
  id: number
  patient: number
  blood_type: string
  units_required: number
  request_date: string
  status: string
}

export default function MyBloodRequestsPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<BloodRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRequests = async () => {
      const data = await getBloodRequests()
      setRequests(data)
      setIsLoading(false)
    }

    fetchRequests()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500"
      case "approved":
        return "bg-blue-500"
      case "fulfilled":
        return "bg-green-500"
      case "declined":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Pause className="w-6 h-6" />
      case "approved":
        return <Play className="w-6 h-6" />
      case "fulfilled":
        return <Check className="w-6 h-6" />
      case "declined":
        return <X className="w-6 h-6" />
      default:
        return <Hash className="w-6 h-6" />
    }
  }

  return (
    <div className="container mx-auto mt-20 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Blood Requests</h1>
        <Button onClick={() => router.push("/blood/requests/new")} className="bg-red-500 hover:bg-red-600">
          <Plus className="w-4 h-4 mr-2" />
          New Request
        </Button>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <Card className="glass-card bg-white/20">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            </CardContent>
          </Card>
        ) : requests.length === 0 ? (
          <Card className="glass-card bg-white/20">
            <CardContent className="p-8 text-center text-white">
              <p>No blood requests found.</p>
            </CardContent>
          </Card>
        ) : (
          requests.map((request) => (
            <Card key={request.id} className="glass-card bg-white/20 hover:bg-white/30 transition-colors">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  <div className="flex items-center space-x-4 text-white">
                    <div className="p-3 bg-red-500/20 rounded-full">
                      <Hash className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-300">Request ID</p>
                      <p className="text-lg font-semibold">{request.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-white">
                    <div className="p-3 bg-red-500/20 rounded-full">
                      <Droplet className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-300">Blood Type</p>
                      <p className="text-lg font-semibold">{request.blood_type}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-white">
                    <div className="p-3 bg-red-500/20 rounded-full">
                      <Hash className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-300">Units Required</p>
                      <p className="text-lg font-semibold">{request.units_required} units</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-white">
                    <div className="p-3 bg-red-500/20 rounded-full">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-300">Request Date</p>
                      <p className="text-lg font-semibold">
                        {format(new Date(request.request_date), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-white">
                      <div className="p-3 bg-red-500/20 rounded-full">
                        {getStatusIcon(request.status)}
                      </div>
                      <div>
                        <p className="text-sm text-gray-300">Status</p>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
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
    </div>
  )
} 