"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { getWorkerRequests, getWorkerRequestDetails, getWorkerRequestsByStatus } from "@/app/actions"
import { Badge } from "@/components/ui/badge"
import { Hash, Calendar, Clock, MapPin, Droplet, Check, X, Pause, Play, Activity } from "lucide-react"
import { format } from "date-fns"
import RequestDetailsModal from "@/app/components/RequestDetailsModal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function WorkerRequestsPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true)
        const data = selectedStatus === "all" 
          ? await getWorkerRequests()
          : await getWorkerRequestsByStatus(selectedStatus)
        setRequests(data || [])
      } catch (error) {
        console.error("Error fetching requests:", error)
        setRequests([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchRequests()
  }, [selectedStatus])

  const handleRequestClick = async (requestId: number) => {
    try {
      const details = await getWorkerRequestDetails(requestId)
      if (details) {
        setSelectedRequest(details)
        setIsModalOpen(true)
      }
    } catch (error) {
      console.error("Error fetching request details:", error)
    }
  }

  const handleStatusUpdate = () => {
    // Refresh the requests list
    const fetchRequests = async () => {
      try {
        setIsLoading(true)
        const data = await getWorkerRequests()
        setRequests(data || [])
      } catch (error) {
        console.error("Error fetching requests:", error)
        setRequests([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchRequests()
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
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
    switch (status?.toLowerCase()) {
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

  const formatLocation = (location: any) => {
    if (!location) return "Not specified"
    return location.name
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">All Requests</h1>
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
        <h1 className="text-3xl font-bold text-white">All Requests</h1>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px] bg-white/20 text-white border-white/20">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Requests</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="fulfilled">Fulfilled</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        {requests.length === 0 ? (
          <Card className="glass-card bg-white/20">
            <CardContent className="p-8 text-center text-white">
              <p>No requests found.</p>
            </CardContent>
          </Card>
        ) : (
          requests.map((request) => (
            <Card 
              key={request.id} 
              className="glass-card bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
              onClick={() => handleRequestClick(request.id)}
            >
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
                      <Activity className="w-6 h-6" />
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

      <RequestDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        request={selectedRequest}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  )
} 