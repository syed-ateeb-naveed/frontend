"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getWorkerDonations, getWorkerRequests, getWorkerInventory } from "@/app/actions"
import { Droplet, Syringe } from "lucide-react"
import { useRouter } from "next/navigation"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export default function WorkerDashboard() {
  const router = useRouter()
  const [donations, setDonations] = useState<any[]>([])
  const [requests, setRequests] = useState<any[]>([])
  const [inventory, setInventory] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const [donationsData, requestsData, inventoryData] = await Promise.all([
        getWorkerDonations(),
        getWorkerRequests(),
        getWorkerInventory()
      ])
      setDonations(donationsData)
      setRequests(requestsData)
      setInventory(inventoryData)
      setIsLoading(false)
    }
    fetchData()
  }, [])

  const pendingDonations = donations.filter(d => d.status === "pending").length
  const pendingRequests = requests.filter(r => r.status === "pending").length

  const inventoryData = inventory ? [
    { name: "Available", value: inventory.units_available },
    { name: "Allocated", value: inventory.units_allocated }
  ] : []

  const COLORS = ["#22c55e", "#ef4444"]

  return (
    <div className="container mx-auto px-4">
      {inventory && (
        <div className="mb-8">
          <div className="glass-card bg-white/20 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-6">Blood Inventory</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-300">Units Available</p>
                  <p className="text-3xl font-bold text-green-500">{inventory.units_available}</p>
                </div>
                <div>
                  <p className="text-gray-300">Units Allocated</p>
                  <p className="text-3xl font-bold text-red-500">{inventory.units_allocated}</p>
                </div>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={inventoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {inventoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        border: 'none',
                        borderRadius: '4px',
                        color: 'white'
                      }}
                      itemStyle={{ color: 'white' }}
                      labelStyle={{ color: 'white' }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value) => <span className="text-white">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card 
          className="glass-card bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
          onClick={() => router.push("/worker/donations?status=pending")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold text-white">Pending Donations</CardTitle>
            <Syringe className="h-6 w-6 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{pendingDonations}</div>
            <p className="text-gray-300">Donations awaiting processing</p>
          </CardContent>
        </Card>

        <Card 
          className="glass-card bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
          onClick={() => router.push("/worker/requests?status=pending")}
        >
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