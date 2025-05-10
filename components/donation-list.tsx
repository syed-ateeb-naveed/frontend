import { getDonations } from "@/app/actions"

export async function DonationList() {
  const donations = await getDonations()

  if (donations.length === 0) {
    return <p>No donations available</p>
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <div className="space-y-4">
        {donations.map((donation: any) => (
          <div key={donation.id} className="p-4 border-b border-gray-200 text-black">
            <h2 className="text-xl font-semibold">Donation {donation.id}</h2>
            <p>
              <span className="font-semibold">Donor ID:</span> {donation.donor}
            </p>
            <p>
              <span className="font-semibold">Date:</span> {new Date(donation.date).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">Time:</span> {donation.time}
            </p>
            <p>
              <span className="font-semibold">Units:</span> {donation.units}
            </p>
            <p>
              <span className="font-semibold">Location:</span> {donation.location}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

