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
  const [inventory, setInventory] = useState<any[]>([])
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

  const totalAvailable = inventory.reduce((sum, grp) => sum + grp.units_available, 0)
  const totalAllocated = inventory.reduce((sum, grp) => sum + grp.units_allocated, 0)

  const inventoryChartData = [
    { name: "Available", value: totalAvailable },
    { name: "Allocated", value: totalAllocated }
  ]
  const COLORS = ["#22c55e", "#ef4444"]

  return (
    <div className="container mx-auto px-4">
      {inventory.length > 0 && (
        <div className="mb-8">
          <div className="glass-card bg-white/20 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-6">Inventory</h2>

            {/* Side-by-side layout: table on left, chart on right */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

              {/* Table section */}
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto text-left text-white">
                  <thead>
                    <tr className="border-b border-gray-400">
                      <th className="px-4 py-2">Blood Group</th>
                      <th className="px-4 py-2">Units Available</th>
                      <th className="px-4 py-2">Units Allocated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((grp) => (
                      <tr key={grp.id} className="border-b border-gray-700">
                        <td className="px-4 py-2">{grp.blood_group}</td>
                        <td className="px-4 py-2">{grp.units_available}</td>
                        <td className="px-4 py-2">{grp.units_allocated}</td>
                      </tr>
                    ))}
                    <tr className="border-t border-gray-500 font-bold">
                      <td className="px-4 py-2">Total</td>
                      <td className="px-4 py-2">{totalAvailable}</td>
                      <td className="px-4 py-2">{totalAllocated}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Chart section (vertically centered) */}
              <div className="h-[300px] self-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={inventoryChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label
                    >
                      {inventoryChartData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        border: "none",
                        borderRadius: "4px",
                        color: "white",
                      }}
                      itemStyle={{ color: "white" }}
                      labelStyle={{ color: "white" }}
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

      {/* Pending cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          className="glass-card bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
          onClick={() => router.push("/worker/donations?status=pending")}
        >
          <CardHeader className="flex items-center justify-between pb-2">
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
          <CardHeader className="flex items-center justify-between pb-2">
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
