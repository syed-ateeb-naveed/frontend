import { getDonor, getUserInfo } from "@/app/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Add this line to force dynamic rendering
export const dynamic = "force-dynamic"

export default async function ProfilePage() {
  const userResponse = await getUserInfo()

  if (!userResponse.success) {
    return (
      <div className="container mx-auto mt-20 px-4">
        <Card className="glass-card text-black max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{userResponse.error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const user = userResponse.data
  const donor = await getDonor()

  return (
    <div className="container mx-auto mt-20 px-4">
      <Card className="glass-card text-black max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto bg-red-500/20 rounded-full p-4 mb-4">
            <UserCircle className="w-20 h-20" />
          </div>
          <CardTitle className="text-2xl">{`${user.first_name} ${user.last_name}`}</CardTitle>
          <p className="text-gray-700 mt-2">{user.email}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic User Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-gray-300 pb-2">User Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-gray-700">First Name</p>
                <p className="text-xl font-semibold">{user.first_name}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-700">Last Name</p>
                <p className="text-xl font-semibold">{user.last_name}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-700">Date of Birth</p>
                <p className="text-xl font-semibold">{new Date(user.date_of_birth).toLocaleDateString()}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-700">Age</p>
                <p className="text-xl font-semibold">{user.age}</p>
              </div>
            </div>
          </div>

          {/* Donor Information */}
          {donor ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b border-gray-300 pb-2">Donor Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-gray-700">Blood Type</p>
                  <p className="text-xl font-semibold text-red-400">{donor.blood_group}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700">Last Donation</p>
                  <p className="text-xl font-semibold">{donor.last_donation || "No donations yet"}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700">Gender</p>
                  <p className="text-xl font-semibold">{donor.gender}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700">Height</p>
                  <p className="text-xl font-semibold">{donor.height} cm</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700">Weight</p>
                  <p className="text-xl font-semibold">{donor.weight} kg</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700">Health Conditions</p>
                  <p className="text-xl font-semibold">{donor.ailments || "None"}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-gray-700">You are not registered as a donor yet.</p>
              <Button asChild className="button-primary">
                <Link href="/blood/donors/register">Register as Donor</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

