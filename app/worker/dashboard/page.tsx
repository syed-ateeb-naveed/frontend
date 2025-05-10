"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getWorkerDonations, getWorkerRequests } from "@/app/actions"
import { Droplet, Syringe } from "lucide-react"

export default function WorkerDashboard() {
  const [donations, setDonations] = useState<any[]>([])
  const [requests, setRequests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const [donationsData, requestsData] = await Promise.all([
        getWorkerDonations(),
        getWorkerRequests()
      ])
      setDonations(donationsData)
      setRequests(requestsData)
      setIsLoading(false)
    }
    fetchData()
  }, [])

  const pendingDonations = donations.filter(d => d.status === "pending").length
  const pendingRequests = requests.filter(r => r.status === "pending").length

  return (
    <div className="container mx-auto px-4">
     
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card bg-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold text-white">Pending Donations</CardTitle>
            <Syringe className="h-6 w-6 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{pendingDonations}</div>
            <p className="text-gray-300">Donations awaiting processing</p>
          </CardContent>
        </Card>

        <Card className="glass-card bg-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold text-white">Pending Requests</CardTitle>
            <Droplet className="h-6 w-6 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{pendingRequests}</div>
            <p className="text-gray-300">Blood requests awaiting approval</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 