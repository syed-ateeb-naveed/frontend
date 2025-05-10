"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { getWorkerRequests, getWorkerRequestDetails } from "@/app/actions"
import { Badge } from "@/components/ui/badge"
import { Hash, Calendar, Droplet, Activity } from "lucide-react"
import { format } from "date-fns"
import RequestDetailsModal from "@/app/components/RequestDetailsModal"

export default function WorkerRequestsPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
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
  }, [])

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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">All Blood Requests</h1>
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
      <h1 className="text-3xl font-bold text-white mb-8">All Blood Requests</h1>

      <div className="space-y-6">
        {requests.length === 0 ? (
          <Card className="glass-card bg-white/20">
            <CardContent className="p-8 text-center text-white">
              <p>No blood requests found.</p>
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
                        {request.request_date ? format(new Date(request.request_date), "MMM dd, yyyy") : "N/A"}
                      </p>
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
      />
    </div>
  )
} 