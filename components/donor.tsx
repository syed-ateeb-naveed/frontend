import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getDonor } from "@/app/actions"

export async function DonorInfo() {
  const donor = await getDonor()

  if (!donor) {
    return <p>No donor data available</p>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card key={donor.id} className="bg-red-50">
        <CardHeader>
          <CardTitle className="text-primary">{`${donor.user.first_name} ${donor.user.last_name}`}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Blood Type: <span className="font-semibold text-primary">{donor.blood_group}</span>
          </p>
          <p>Last Donation: {donor.last_donation || "N/A"}</p>
          <p>Gender: {donor.gender}</p>
          <p>Height: {donor.height}</p>
          <p>Weight: {donor.weight}</p>
          <p>Ailments: {donor.ailments}</p>
        </CardContent>
      </Card>
    </div>
  )
}

