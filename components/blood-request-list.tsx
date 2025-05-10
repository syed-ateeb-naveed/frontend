import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

interface BloodRequestListProps {
  requests: BloodRequest[]
}

export function BloodRequestList({ requests }: BloodRequestListProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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

  return (
    <div className="grid gap-4">
      {requests.map((request) => (
        <Card key={request.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Request {request.id}
            </CardTitle>
            <Badge className={getStatusColor(request.status)}>
              {request.status}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Blood Type</p>
                <p className="font-medium">{request.blood_type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Units Required</p>
                <p className="font-medium">{request.units_required}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Request Date</p>
                <p className="font-medium">
                  {format(new Date(request.request_date), "MMM dd, yyyy")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 